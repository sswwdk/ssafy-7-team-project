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
    <AppHeader />
    <main class="page-shell">
      <RouterView />
    </main>
    <button
      type="button"
      class="theme-toggle-button"
      :aria-label="isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'"
      :aria-pressed="isDarkMode"
      @click="toggleTheme"
    >
      <span aria-hidden="true">{{ isDarkMode ? '☀️' : '🌙' }}</span>
      {{ isDarkMode ? '라이트 모드' : '다크 모드' }}
    </button>
    <ChatbotWidget />
  </div>
</template>
