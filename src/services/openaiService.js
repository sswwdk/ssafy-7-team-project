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

function formatContext({ regionMatches, postMatches, tourismContext }) {
  const regionContext = regionMatches.length
    ? regionMatches.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        address: item.address,
        description: item.description,
        startDate: item.startDate,
        endDate: item.endDate,
        mapAvailable: Number.isFinite(item.latitude) && Number.isFinite(item.longitude)
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
      communityPosts: postContext,
      tourismSearch: tourismContext
        ? {
            ...tourismContext,
            hasMore: tourismContext.totalCount > regionContext.length
          }
        : null
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

export async function requestChatbotAnswer({
  question,
  regionMatches,
  postMatches,
  tourismContext,
  currentDate
}) {
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
        instructions: [
          '당신은 LocalHub 서울 지역정보 안내 챗봇입니다. 제공된 지역 JSON과 현재 브라우저의 커뮤니티 게시글만 근거로 한국어로 간결하게 답하세요. 근거가 부족하면 추측하지 말고 정보가 없다고 안내하세요. 비밀번호나 API 키를 요청하거나 출력하지 마세요. 답변에 Markdown 문법을 사용하지 마세요. 특히 ##, ###, *, -, 백틱을 제목이나 목록 표시에 사용하지 마세요. 축제·행사 월별 질문은 다음 일반 텍스트 형식을 따르세요: 첫 줄은 "안녕하세요! 오늘 기준(YYYY-MM-DD) ..."라는 안내 문장으로 시작합니다. 빈 줄 뒤 "축제/행사 목록"을 쓰고, 각 항목은 "1. 행사명", 다음 줄에 들여쓰기 3칸과 "기간: 시작일 ~ 종료일", 그다음 줄에 들여쓰기 3칸과 "장소: 주소"로 씁니다. 데이터에 주소가 없으면 장소 줄은 생략합니다. 빈 줄 뒤 관련 커뮤니티 게시글이 있을 때만 "커뮤니티 글"을 쓰고, 각 글은 "[제목]" 다음 줄에 "작성일: YYYY-MM-DD" 형식으로 씁니다. 관련 글이 없으면 커뮤니티 글 구역 자체를 쓰지 마세요. 마지막에는 "다른 서울 지역 정보도 궁금하시면 언제든지 물어보세요!"로 끝내세요. 연중 행사도 축제/행사 목록에 포함하되 기간을 그대로 표시하세요. 제공되지 않은 시간, 티켓, 프로그램 정보는 만들지 마세요.',
          '사용자가 커뮤니티 글 목록을 요청하면 제공된 communityPosts의 모든 글을 빠뜨리지 말고 안내하세요. 이때 "커뮤니티 글" 다음에 각 글을 "[제목]"과 다음 줄 "작성일: YYYY-MM-DD" 형식으로 표시하세요. 글이 없을 때만 커뮤니티 게시글 정보가 없다고 안내하세요.',
          '사용자가 축제, 공연 또는 행사 정보를 물었는데 제공된 regionData가 비어 있으면 "요청하신 기간에 등록된 서울 축제·공연·행사 정보가 없습니다."라고 분명히 안내하세요. 존재하지 않는 행사나 날짜를 만들지 마세요.',
          '축제·행사 등 지역 정보 질문에서도 제공된 communityPosts는 최신 커뮤니티 글 목록입니다. 글이 있으면 "커뮤니티 글" 구역에 제공된 모든 글을 제목과 작성일 형식으로 표시하고, 일부만 임의로 골라서 표시하지 마세요.',
          '관광지와 축제·공연·행사 질문에서는 커뮤니티 글 구역이나 커뮤니티 글 내용을 절대 출력하지 마세요.',
          '지도 핀이 있는 regionData 항목의 이름은 반드시 "[[map:장소ID|장소명]]" 형식으로 출력하세요. 이 표기는 화면에서 장소명 지도 링크로 변환됩니다. mapAvailable이 false인 항목은 일반 장소명으로 출력하세요.',
          '관광지 질문에서 tourismSearch가 제공되면 다음 형식으로 답하세요. 첫 줄: "안녕하세요! {districtName}에 대한 관광지 정보입니다!" 빈 줄 뒤 "관광지 목록"을 쓰세요. regionData의 각 항목은 "1. 관광지명" 다음 줄에 들여쓰기 3칸과 "주소: 주소"로 표시하세요. 관광지 목록은 제공된 항목만 표시합니다. tourismSearch.totalCount가 0이면 "등록된 관광지 정보가 없습니다."라고 안내하세요. tourismSearch.hasMore가 true이면 목록 뒤에 "더 많은 관광지는 지도 페이지에서 확인해 보세요!"라고 안내하세요. 관광지 답변 예시: "안녕하세요! 중구에 대한 관광지 정보입니다!\n\n관광지 목록\n1. [[map:example-id|예시 관광지]]\n   주소: 서울특별시 중구 예시로 1\n\n더 많은 관광지는 지도 페이지에서 확인해 보세요!"',
        ].join(' '),
        input: `Current local date: ${formatLocalDate(currentDate || new Date())}
Use this date as the source of truth for questions about this month or next month. Do not ask the user to provide today's date.

사용자 질문: ${question}

검색된 컨텍스트:
${formatContext({
  regionMatches,
  postMatches,
  tourismContext
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
