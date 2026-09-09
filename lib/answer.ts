import type { ChatSource } from "@/lib/chat";
import type { DocumentPayload } from "@/lib/documents";
import {
    describeOpenRouterError,
    OPENROUTER_SYSTEM_PROMPT,
    openRouterStream,
} from "@/lib/openrouter";

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

      return `DOCUMENT ${index + 1}: ${document.name}\nSOURCE NUMBER: [${index + 1}]\n\n${content}`
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
  const indexes = [...answer.matchAll(/\[(\d+)\]/g)].map((match) =>
    Number(match[1])
  )
  const uniqueIndexes = [...new Set(indexes)].filter(
    (index) => index >= 1 && index <= documents.length
  )

  return uniqueIndexes.map((index) => {
    const document = documents[index - 1]
    return {
      index,
      documentId: document.id,
      document: document.name,
      page: null,
      passages: [],
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
