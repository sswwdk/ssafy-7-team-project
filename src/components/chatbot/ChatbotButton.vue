<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])
</script>

<template>
  <button
    class="chatbot-floating-button"
    type="button"
    :aria-expanded="isOpen"
    aria-label="지역정보 챗봇 열기"
    @click="$emit('toggle')"
  >
    {{ isOpen ? '닫기' : 'AI' }}
  </button>
</template>
