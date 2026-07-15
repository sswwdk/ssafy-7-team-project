import { ref } from 'vue'
import {
  CHATBOT_POST_CONTEXT_LIMIT,
  CHATBOT_REGION_CONTEXT_LIMIT,
  CHATBOT_TOURISM_CONTEXT_LIMIT
} from '@/constants/chatbot'
import { getPosts } from '@/services/postStorageService'
import { requestChatbotAnswer } from '@/services/openaiService'
import {
  getDistrictOptions,
  getFestivalItemsForMonth,
  getTourismItems,
  searchRegionData
} from '@/services/regionDataService'

const messages = ref([
  {
    id: 'welcome',
    role: 'assistant',
    content: `안녕하세요!

서울 축제, 관광지, 커뮤니티 정보를 찾아드릴게요.

이렇게 질문해 보세요.
 - 이번 달 서울 축제 알려줘
 - 중구에서 하는 축제 알려줘
 - 강남구 관광지 알려줘
 - 커뮤니티에는 어떤 글이 있어?`
  }
])
const isLoading = ref(false)
const errorMessage = ref('')

function getRecentCommunityPosts() {
  return getPosts().slice(0, CHATBOT_POST_CONTEXT_LIMIT)
}

function getRequestedFestivalMonth(query, referenceDate = new Date()) {
  if (!/축제|공연|행사/.test(query)) {
    return null
  }

  const compactQuery = query.replace(/\s+/g, '')
  const yearMonthMatch = compactQuery.match(/(\d{4})년(\d{1,2})월/)

  if (yearMonthMatch) {
    const year = Number(yearMonthMatch[1])
    const month = Number(yearMonthMatch[2])

    if (month >= 1 && month <= 12) {
      return new Date(year, month - 1, 1)
    }
  }

  if (/다음달|내달/.test(compactQuery)) {
    return new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1)
  }

  if (/이번달|이달|현재달/.test(compactQuery)) {
    return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1)
  }

  const monthMatch = compactQuery.match(/(1[0-2]|[1-9])월/)

  if (monthMatch) {
    return new Date(referenceDate.getFullYear(), Number(monthMatch[1]) - 1, 1)
  }

  return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1)
}

function getRequestedDistrictName(query) {
  return getDistrictOptions().find(({ name }) => query.includes(name))?.name || ''
}

function searchChatbotContext(query) {
  const districtName = getRequestedDistrictName(query)

  if (/관광지/.test(query)) {
    const tourismItems = getTourismItems(districtName)

    return {
      regionMatches: tourismItems.slice(0, CHATBOT_TOURISM_CONTEXT_LIMIT),
      tourismContext: {
        districtName: districtName || '서울',
        totalCount: tourismItems.length
      },
      hideCommunityPosts: true
    }
  }

  const requestedFestivalMonth = getRequestedFestivalMonth(query)

  if (requestedFestivalMonth) {
    return {
      regionMatches: getFestivalItemsForMonth(requestedFestivalMonth, districtName),
      tourismContext: null,
      hideCommunityPosts: true
    }
  }

  return {
    regionMatches: searchRegionData(query, CHATBOT_REGION_CONTEXT_LIMIT),
    tourismContext: null,
    hideCommunityPosts: false
  }
}

export function useChatbot() {
  async function sendMessage(rawMessage) {
    const question = rawMessage.trim()

    if (!question || isLoading.value) {
      return
    }

    errorMessage.value = ''
    messages.value.push({
      id: crypto.randomUUID(),
      role: 'user',
      content: question
    })
    isLoading.value = true

    try {
      const chatbotContext = searchChatbotContext(question)
      const answer = await requestChatbotAnswer({
        question,
        regionMatches: chatbotContext.regionMatches,
        postMatches: chatbotContext.hideCommunityPosts ? [] : getRecentCommunityPosts(),
        tourismContext: chatbotContext.tourismContext,
        currentDate: new Date()
      })

      messages.value.push({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: answer
      })
    } catch (error) {
      errorMessage.value = error.message || '챗봇 요청 중 오류가 발생했습니다.'
      messages.value.push({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '답변을 불러오지 못했습니다. 환경변수와 API 사용량을 확인한 뒤 다시 시도해 주세요.'
      })
    } finally {
      isLoading.value = false
    }
  }

  function clearMessages() {
    messages.value = [messages.value[0]]
    errorMessage.value = ''
  }

  return {
    messages,
    isLoading,
    errorMessage,
    sendMessage,
    clearMessages
  }
}
