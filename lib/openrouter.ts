const DEFAULT_MODEL = "openrouter/free"

export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL

export const OPENROUTER_SYSTEM_PROMPT = `You are Docsy. Answer strictly from the documents included in the user message.

Rules:
- Use only the provided documents. Never answer from prior knowledge or guess.
- Ground every factual claim in the documents.
- When the documents do not answer the question, say so plainly.
- Lead with the answer and keep it as concise as the question requires.
- Use real Markdown.
- Add a source marker such as [1:0] or [2:3] after factual claims. The first number must match the document number and the second number must match the numbered passage containing the claim.
- Do not invent source numbers. Do not put source markers in headings.`

export const OPENROUTER_BRIEF_ANALYSIS_PROMPT = `Read the attached document end to end, then brief the developer who has to build from it.

Write these sections in order, skipping any section the document genuinely does not support:

## Summary
What is being asked for, in a few sentences.

## Pain points
The problems the client wants solved. Give each one its own ### heading and explain it underneath.

## Their questions, answered
Answer every question raised in the document. If the document does not settle one, say what would.

## Scope and requirements
List the concrete pages, features, integrations, content, and constraints.

## Gaps and risks
List missing decisions, contradictions, and unresolved assumptions.`

export function openRouterApiKey() {
  return process.env.OPENROUTER_API_KEY?.trim() || undefined
}

export function isOpenRouterConfigured() {
  return Boolean(openRouterApiKey())
}

export function describeOpenRouterError(error: unknown) {
  if (error instanceof OpenRouterError) {
    if (error.status === 401 || error.status === 403) {
      return "Docsy's OpenRouter key is missing, invalid, or not permitted to use this model."
    }

    if (error.status === 429) {
      return "OpenRouter rate limited this request. Try again in a moment."
    }

    return `OpenRouter returned an error (${error.status}).`
  }

  if (error instanceof TypeError) {
    return "Couldn't reach OpenRouter. Check your connection and try again."
  }

  return "Something went wrong generating that answer."
}

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = "OpenRouterError"
  }
}

export async function openRouterStream(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  signal?: AbortSignal
) {
  const key = openRouterApiKey()
  if (!key) throw new OpenRouterError("OPENROUTER_API_KEY is not set", 503)

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-OpenRouter-Title": "Docsy",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      stream: true,
    }),
    signal,
  })

  if (!response.ok) {
    const body = await response.text()
    throw new OpenRouterError(body || response.statusText, response.status)
  }

  if (!response.body) {
    throw new OpenRouterError("OpenRouter returned no response body", 502)
  }

  return response.body
}
