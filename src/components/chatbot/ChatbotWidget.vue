<script setup>
import { ref } from 'vue'
import ChatbotButton from './ChatbotButton.vue'
import ChatbotPanel from './ChatbotPanel.vue'

const isOpen = ref(false)
</script>

<template>
  <ChatbotPanel :is-open="isOpen" @close="isOpen = false" />
  <ChatbotButton :is-open="isOpen" @toggle="isOpen = !isOpen" />
</template>
