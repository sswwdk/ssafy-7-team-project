<script setup>
import { nextTick, ref, watch } from 'vue'
import ChatMessage from './ChatMessage.vue'
import { useChatbot } from '@/composables/useChatbot'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const { messages, isLoading, errorMessage, sendMessage, clearMessages } = useChatbot()
const inputMessage = ref('')
const messageList = ref(null)

watch(
  () => [props.isOpen, messages.value.length],
  async () => {
    await nextTick()

    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight
    }
  }
)

async function submitMessage() {
  const message = inputMessage.value
  inputMessage.value = ''
  await sendMessage(message)
}
</script>

<template>
  <section v-if="isOpen" class="chatbot-panel" aria-label="지역정보 챗봇">
    <header class="chatbot-header">
      <div>
        <strong>LocalHub AI</strong>
        <span>서울 지역 JSON + 내 게시글</span>
      </div>
      <div class="chatbot-header-actions">
        <button type="button" class="icon-button" @click="clearMessages">초기화</button>
        <button type="button" class="icon-button" @click="emit('close')">닫기</button>
      </div>
    </header>

    <div ref="messageList" class="chatbot-messages" aria-live="polite">
      <ChatMessage v-for="message in messages" :key="message.id" :message="message" />
      <p v-if="isLoading" class="chatbot-status">답변을 생성하고 있습니다.</p>
    </div>

    <p v-if="errorMessage" class="chatbot-error">{{ errorMessage }}</p>

    <form class="chatbot-form" @submit.prevent="submitMessage">
      <label class="sr-only" for="chatbot-input">질문 입력</label>
      <textarea
        id="chatbot-input"
        v-model="inputMessage"
        rows="2"
        maxlength="500"
        placeholder="예: 이번 달 서울 축제를 알려줘"
        :disabled="isLoading"
        @keydown.enter.exact.prevent="submitMessage"
      />
      <button
        class="button button-primary"
        type="submit"
        :disabled="isLoading || !inputMessage.trim()"
      >
        전송
      </button>
    </form>
  </section>
</template>
