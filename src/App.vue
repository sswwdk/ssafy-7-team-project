<script setup>
import AppHeader from '@/components/common/AppHeader.vue'
import ChatbotWidget from '@/components/chatbot/ChatbotWidget.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="page-shell">
      <RouterView />
    </main>
    <ChatbotWidget />
  </div>
</template>
