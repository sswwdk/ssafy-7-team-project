<script setup>
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
defineProps({
  title: {
    type: String,
    default: '표시할 내용이 없습니다.'
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <section class="state-box" aria-live="polite">
    <strong>{{ t(title) }}</strong>
    <p v-if="description">{{ t(description) }}</p>
    <slot />
  </section>
</template>
