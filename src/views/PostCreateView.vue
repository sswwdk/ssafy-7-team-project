<script setup>
import { useRouter } from 'vue-router'
import PostForm from '@/components/community/PostForm.vue'
import { usePosts } from '@/composables/usePosts'
import { useLocale } from '@/composables/useLocale'
import { ROUTE_NAMES } from '@/constants/routes'

const router = useRouter()
const { createPost } = usePosts()
const { t } = useLocale()

function submitPost(input) {
  const post = createPost(input)
  router.push({ name: ROUTE_NAMES.POST_DETAIL, params: { id: post.id } })
}
</script>

<template>
  <div class="container narrow-container page-stack">
    <div>
      <p class="eyebrow">Community</p>
      <h1>{{ t('게시글 작성') }}</h1>
    </div>
    <PostForm
      :submit-label="t('등록')"
      @submit="submitPost"
      @cancel="router.push({ name: ROUTE_NAMES.POSTS })"
    />
  </div>
</template>
