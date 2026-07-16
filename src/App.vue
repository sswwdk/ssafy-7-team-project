<script setup>
import { onMounted, ref } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import ChatbotWidget from '@/components/chatbot/ChatbotWidget.vue'
import { THEME_STORAGE_KEY } from '@/constants/storage'

const isDarkMode = ref(false)

function applyTheme(darkMode, persist = true) {
  isDarkMode.value = darkMode
  document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'

  if (persist) {
    localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light')
  }
}

function toggleTheme() {
  applyTheme(!isDarkMode.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark, false)
})
</script>

<template>
  <div class="app-shell">
    <AppHeader :is-dark-mode="isDarkMode" @toggle-theme="toggleTheme" />
    <main class="page-shell">
      <RouterView />
    </main>
    <ChatbotWidget />
  </div>
</template>
