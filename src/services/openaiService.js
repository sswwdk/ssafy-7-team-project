import {
  CHATBOT_TIMEOUT_MS,
  OPENAI_API_URL,
  OPENAI_MAX_OUTPUT_TOKENS,
  OPENAI_MODEL
} from '@/constants/chatbot'

function extractOutputText(data) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim()
  }

  const textParts = (data.output || [])
    .flatMap((item) => item.content || [])
    .filter((content) => content.type === 'output_text')
    .map((content) => content.text)
    .filter(Boolean)

  return textParts.join('\n').trim()
}

function formatContext({ regionMatches, postMatches }) {
  const regionContext = regionMatches.length
    ? regionMatches.map((item) => ({
        name: item.name,
        category: item.category,
        address: item.address,
        description: item.description,
        startDate: item.startDate,
        endDate: item.endDate
      }))
    : []

  const postContext = postMatches.length
    ? postMatches.map((post) => ({
        category: post.category,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt
      }))
    : []

  return JSON.stringify(
    {
      regionData: regionContext,
      communityPosts: postContext
    },
    null,
    2
  )
}

function formatLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export async function requestChatbotAnswer({ question, regionMatches, postMatches, currentDate }) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY?.trim()

  if (!apiKey) {
    throw new Error('VITE_OPENAI_API_KEY가 설정되지 않았습니다.')
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), CHATBOT_TIMEOUT_MS)

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: OPENAI_MODEL,
        reasoning: {
          effort: 'minimal'
        },
        instructions:
          '당신은 LocalHub 서울 지역정보 안내 챗봇입니다. 제공된 지역 JSON과 현재 브라우저의 커뮤니티 게시글만 근거로 한국어로 간결하게 답하세요. 근거가 부족하면 추측하지 말고 정보가 없다고 안내하세요. 비밀번호나 API 키를 요청하거나 출력하지 마세요.',
        input: `Current local date: ${formatLocalDate(currentDate || new Date())}
Use this date as the source of truth for questions about this month or next month. Do not ask the user to provide today's date.

사용자 질문: ${question}

검색된 컨텍스트:
${formatContext({
  regionMatches,
  postMatches
})}`,
        max_output_tokens: OPENAI_MAX_OUTPUT_TOKENS
      })
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const errorMessage = data.error?.message || 'OpenAI API 요청에 실패했습니다.'
      throw new Error(errorMessage)
    }

    const outputText = extractOutputText(data)

    if (!outputText) {
      throw new Error('응답 내용이 비어 있습니다.')
    }

    return outputText
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.', { cause: error })
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}
