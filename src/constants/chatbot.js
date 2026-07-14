export const OPENAI_API_URL = 'https://api.openai.com/v1/responses'
export const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL?.trim() || 'gpt-5.6'
export const OPENAI_MAX_OUTPUT_TOKENS = 500
export const CHATBOT_TIMEOUT_MS = 20000
export const CHATBOT_REGION_CONTEXT_LIMIT = 8
export const CHATBOT_POST_CONTEXT_LIMIT = 5
