<script setup>
import { computed } from 'vue'
import { ROUTE_NAMES } from '@/constants/routes'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const messageParts = computed(() => {
  const pattern = /\[\[map:([^|\]\r\n]+)\|([^\r\n]*?)\]\]/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = pattern.exec(props.message.content))) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: props.message.content.slice(lastIndex, match.index) })
    }

    parts.push({ type: 'map-link', id: match[1], content: match[2] })
    lastIndex = pattern.lastIndex
  }

  if (lastIndex < props.message.content.length) {
    parts.push({ type: 'text', content: props.message.content.slice(lastIndex) })
  }

  return parts.length ? parts : [{ type: 'text', content: props.message.content }]
})
</script>

<template>
  <div class="chat-row" :class="`chat-row-${message.role}`">
    <p class="chat-message">
      <template v-for="(part, index) in messageParts" :key="`${part.type}-${index}`">
        <RouterLink
          v-if="part.type === 'map-link'"
          class="chat-map-link"
          :to="{ name: ROUTE_NAMES.MAP, query: { place: part.id } }"
        >
          {{ part.content }}
        </RouterLink>
        <template v-else>{{ part.content }}</template>
      </template>
    </p>
  </div>
</template>
