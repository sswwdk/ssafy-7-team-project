<script setup>
defineProps({
  message: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="chat-row" :class="`chat-row-${message.role}`">
    <p class="chat-message">{{ message.content }}</p>
  </div>
</template>
