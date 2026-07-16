<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])

const chatbotLabel = ref(null)
const expandedWidth = ref('12rem')

async function updateExpandedWidth() {
  await nextTick()

  const labelWidth = chatbotLabel.value?.scrollWidth || 0
  expandedWidth.value = `${labelWidth + 80}px`
}

watch(() => props.isOpen, updateExpandedWidth)
onMounted(updateExpandedWidth)
</script>

<template>
  <button
    class="chatbot-floating-button"
    type="button"
    :aria-expanded="isOpen"
    :style="{ '--chatbot-expanded-width': expandedWidth }"
    aria-label="지역정보 챗봇 열기"
    @click="$emit('toggle')"
  >
    <svg
      v-if="!isOpen"
      class="chatbot-button-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
    <span v-else class="chatbot-button-icon" aria-hidden="true">×</span>
    <span ref="chatbotLabel" class="chatbot-button-label">{{ isOpen ? '닫기' : 'AI 챗봇 도우미' }}</span>
  </button>
</template>
