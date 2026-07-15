const OPENAI_API_URL = 'https://api.openai.com/v1/responses'
const DEFAULT_MODEL = 'gpt-5-mini'
const MAX_OUTPUT_TOKENS = 1200

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body)
  }
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: { message: 'Method not allowed.' } })
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim()

  if (!apiKey) {
    return json(500, {
      error: { message: 'OPENAI_API_KEY is not configured on the server.' }
    })
  }

  let request
  try {
    request = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: { message: 'Invalid request body.' } })
  }

  if (typeof request.instructions !== 'string' || typeof request.input !== 'string') {
    return json(400, { error: { message: 'Invalid chat request.' } })
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 25_000)

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL,
        reasoning: { effort: 'minimal' },
        instructions: request.instructions,
        input: request.input,
        max_output_tokens: MAX_OUTPUT_TOKENS
      })
    })

    const data = await response.json().catch(() => ({}))
    return json(response.status, data)
  } catch (error) {
    const message = error.name === 'AbortError'
      ? 'The OpenAI request timed out.'
      : 'Unable to reach the OpenAI API.'
    return json(502, { error: { message } })
  } finally {
    clearTimeout(timeoutId)
  }
}
