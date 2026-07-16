<script setup>
import { computed } from 'vue'
import { POST_CATEGORY_OPTIONS } from '@/constants/storage'
import { getPostCommentCount } from '@/services/postStorageService'
import { formatDateTime } from '@/utils/date'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const categoryLabel = computed(
  () =>
    POST_CATEGORY_OPTIONS.find((option) => option.value === props.post.category)?.label || '기타'
)
const commentCount = computed(() => getPostCommentCount(props.post))
const recommendationCount = computed(() => Number(props.post.recommendationCount) || 0)
</script>

<template>
  <article class="post-card">
    <div class="post-card-meta">
      <span class="badge">{{ categoryLabel }}</span>
      <time :datetime="post.createdAt">{{ formatDateTime(post.createdAt) }}</time>
    </div>
    <h2>
      <RouterLink :to="`/posts/${post.id}`">{{ post.title }}</RouterLink>
      <span v-if="recommendationCount" class="post-recommendation-count">
        👍 {{ recommendationCount }}
      </span>
      <span v-if="commentCount" class="post-comment-count">💬 +{{ commentCount }}</span>
    </h2>
    <p>{{ post.content }}</p>
  </article>
</template>
