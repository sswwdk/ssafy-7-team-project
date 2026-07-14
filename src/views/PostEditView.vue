<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import EmptyState from '@/components/common/EmptyState.vue'
import PostForm from '@/components/community/PostForm.vue'
import { usePosts } from '@/composables/usePosts'
import { ROUTE_NAMES } from '@/constants/routes'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()
const { findPost, updatePost } = usePosts()
const post = ref(null)
const submitError = ref('')

onMounted(() => {
  post.value = findPost(props.id)
})

function submitPost(input) {
  submitError.value = ''

  try {
    const updatedPost = updatePost(props.id, input)
    router.push({ name: ROUTE_NAMES.POST_DETAIL, params: { id: updatedPost.id } })
  } catch (error) {
    submitError.value = error.message
  }
}
</script>

<template>
  <div class="container narrow-container page-stack">
    <template v-if="post">
      <div>
        <p class="eyebrow">Community</p>
        <h1>게시글 수정</h1>
      </div>
      <p v-if="submitError" class="form-error-banner">{{ submitError }}</p>
      <PostForm
        mode="edit"
        submit-label="수정 완료"
        :initial-post="post"
        @submit="submitPost"
        @cancel="router.push({ name: ROUTE_NAMES.POST_DETAIL, params: { id: props.id } })"
      />
    </template>

    <EmptyState v-else title="게시글을 찾을 수 없습니다.">
      <RouterLink class="button button-primary" :to="{ name: ROUTE_NAMES.POSTS }">
        목록으로
      </RouterLink>
    </EmptyState>
  </div>
</template>
