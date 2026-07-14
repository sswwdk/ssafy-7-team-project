import { ref } from 'vue'
import { CHATBOT_POST_CONTEXT_LIMIT, CHATBOT_REGION_CONTEXT_LIMIT } from '@/constants/chatbot'
import { getPosts } from '@/services/postStorageService'
import { requestChatbotAnswer } from '@/services/openaiService'
import { searchRegionData } from '@/services/regionDataService'

const messages = ref([
  {
    id: 'welcome',
    role: 'assistant',
    content: '안녕하세요. 서울 관광지, 축제, 맛집과 현재 브라우저의 커뮤니티 게시글을 찾아드릴게요.'
  }
])
const isLoading = ref(false)
const errorMessage = ref('')

function searchCommunityPosts(query) {
  const keyword = query.trim().toLowerCase()

  if (!keyword) {
    return []
  }

  const tokens = keyword.split(/\s+/).filter(Boolean)

  return getPosts()
    .filter((post) => {
      const searchableText = `${post.title} ${post.content} ${post.category}`.toLowerCase()
      return tokens.some((token) => searchableText.includes(token))
    })
    .slice(0, CHATBOT_POST_CONTEXT_LIMIT)
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
      const answer = await requestChatbotAnswer({
        question,
        regionMatches: searchRegionData(question, CHATBOT_REGION_CONTEXT_LIMIT),
        postMatches: searchCommunityPosts(question)
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
