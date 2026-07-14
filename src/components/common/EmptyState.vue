<script setup>
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
    <strong>{{ title }}</strong>
    <p v-if="description">{{ description }}</p>
    <slot />
  </section>
</template>
