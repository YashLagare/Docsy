import type { ChatSource } from "@/lib/chat";
import type { DocumentPayload } from "@/lib/documents";
import {
  describeOpenRouterError,
  OPENROUTER_SYSTEM_PROMPT,
  openRouterStream,
} from "@/lib/openrouter";
import { splitPassages } from "@/lib/search";

export type AnswerEvent =
  | { type: "text"; value: string }
  | { type: "done"; sources: ChatSource[] }
  | { type: "error"; value: string }

function buildDocumentPrompt(documents: DocumentPayload[]) {
  return documents
    .map((document, index) => {
      const content =
        document.text?.trim() ||
        "The readable text for this document is unavailable to the selected model."
      const passages = document.text ? splitPassages(document.text) : []
      const labeledContent = passages.length
        ? passages
            .map((passage, passageIndex) => `PASSAGE ${passageIndex}: ${passage}`)
            .join("\n\n")
        : content

      return `DOCUMENT ${index + 1}: ${document.name}\nSOURCE NUMBER: [${index + 1}]\n\n${labeledContent}`
    })
    .join("\n\n---\n\n")
}

export function buildMessages(
  documents: DocumentPayload[],
  history: { role: "USER" | "ASSISTANT"; content: string }[]
) {
  const documentPrompt = buildDocumentPrompt(documents)
  const messages: {
    role: "system" | "user" | "assistant"
    content: string
  }[] = [
    { role: "system", content: OPENROUTER_SYSTEM_PROMPT },
    { role: "user", content: `SOURCE DOCUMENTS:\n\n${documentPrompt}` },
  ]

  history.forEach((message) => {
    messages.push({
      role: message.role === "USER" ? "user" : "assistant",
      content: message.content,
    })
  })

  return messages
}

function createSources(
  answer: string,
  documents: DocumentPayload[]
): ChatSource[] {
  const markers = [...answer.matchAll(/\[(\d+)(?::(\d+))?\]/g)]
  const indexes = markers.map((match) => Number(match[1]))
  const uniqueIndexes = [...new Set(indexes)].filter(
    (index) => index >= 1 && index <= documents.length
  )

  return uniqueIndexes.map((index) => {
    const document = documents[index - 1]
    const passages = document.text ? splitPassages(document.text) : []
    const passageIndexes = markers
      .filter((match) => Number(match[1]) === index)
      .map((match) => (match[2] === undefined ? 0 : Number(match[2])))
      .filter((passageIndex) => passageIndex >= 0 && passageIndex < passages.length)
    const selectedPassages = [...new Set(passageIndexes)]

    return {
      index,
      documentId: document.id,
      document: document.name,
      page: null,
      passages: selectedPassages.map((passageIndex) => ({
        text: passages[passageIndex],
        before: passages[passageIndex - 1] ?? null,
        after: passages[passageIndex + 1] ?? null,
      })),
    }
  })
}

async function* readSseBody(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  try {
    while (true) {
      const { done, value } = await reader.read()
      buffer += decoder.decode(value, { stream: !done })

      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith("data:")) continue

        const data = trimmed.slice(5).trim()
        if (data === "[DONE]") return

        try {
          yield JSON.parse(data) as {
            choices?: { delta?: { content?: string | null } }[]
            error?: { message?: string }
          }
        } catch {
          // Ignore keep-alive comments and incomplete SSE payloads.
        }
      }

      if (done) return
    }
  } finally {
    reader.releaseLock()
  }
}

export async function* streamAnswer(
  documents: DocumentPayload[],
  history: { role: "USER" | "ASSISTANT"; content: string }[]
): AsyncGenerator<AnswerEvent> {
  let answer = ""

  try {
    const body = await openRouterStream(buildMessages(documents, history))

    for await (const event of readSseBody(body)) {
      if (event.error?.message) {
        yield { type: "error", value: event.error.message }
        return
      }

      const text = event.choices?.[0]?.delta?.content
      if (!text) continue

      answer += text
      yield { type: "text", value: text }
    }

    if (!answer.trim()) {
      yield { type: "error", value: "OpenRouter returned an empty answer." }
      return
    }

    yield { type: "done", sources: createSources(answer, documents) }
  } catch (error) {
    console.error("[chat] answer failed", error)
    yield { type: "error", value: describeOpenRouterError(error) }
  }
}
