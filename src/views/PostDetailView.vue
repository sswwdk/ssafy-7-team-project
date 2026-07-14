<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { usePosts } from '@/composables/usePosts'
import { ROUTE_NAMES } from '@/constants/routes'
import { POST_CATEGORY_OPTIONS } from '@/constants/storage'
import { formatDateTime } from '@/utils/date'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()
const { findPost, removePost } = usePosts()
const post = ref(null)
const isDeleteModalOpen = ref(false)
const deleteError = ref('')

const categoryLabel = computed(
  () =>
    POST_CATEGORY_OPTIONS.find((option) => option.value === post.value?.category)?.label || '기타'
)

onMounted(() => {
  post.value = findPost(props.id)
})

function deletePost(password) {
  deleteError.value = ''

  try {
    removePost(props.id, password)
    router.push({ name: ROUTE_NAMES.POSTS })
  } catch (error) {
    deleteError.value = error.message
  }
}
</script>

<template>
  <div class="container narrow-container page-stack">
    <article v-if="post" class="detail-card">
      <div class="post-card-meta">
        <span class="badge">{{ categoryLabel }}</span>
        <time :datetime="post.createdAt">작성 {{ formatDateTime(post.createdAt) }}</time>
      </div>
      <h1>{{ post.title }}</h1>
      <p class="post-content">{{ post.content }}</p>
      <p v-if="post.updatedAt !== post.createdAt" class="help-text">
        최종 수정 {{ formatDateTime(post.updatedAt) }}
      </p>
      <div class="button-row end">
        <RouterLink class="button button-secondary" :to="`/posts/${post.id}/edit`">수정</RouterLink>
        <button class="button button-danger" type="button" @click="isDeleteModalOpen = true">
          삭제
        </button>
      </div>
    </article>

    <EmptyState
      v-else
      title="게시글을 찾을 수 없습니다."
      description="삭제되었거나 잘못된 주소입니다."
    >
      <RouterLink class="button button-primary" :to="{ name: ROUTE_NAMES.POSTS }">
        목록으로
      </RouterLink>
    </EmptyState>

    <ConfirmModal
      :is-open="isDeleteModalOpen"
      title="게시글 삭제"
      confirm-label="삭제"
      :error-message="deleteError"
      @close="isDeleteModalOpen = false"
      @confirm="deletePost"
    />
  </div>
</template>
