<script setup>
import { computed, onMounted, ref } from 'vue'
import EmptyState from '@/components/common/EmptyState.vue'
import PostCard from '@/components/community/PostCard.vue'
import { usePosts } from '@/composables/usePosts'
import { ROUTE_NAMES } from '@/constants/routes'

const { posts, refreshPosts } = usePosts()
const keyword = ref('')
const selectedCategory = ref('all')

const filteredPosts = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLowerCase()

  return posts.value.filter((post) => {
    const matchesCategory =
      selectedCategory.value === 'all' || post.category === selectedCategory.value
    const matchesKeyword =
      !normalizedKeyword ||
      `${post.title} ${post.content}`.toLowerCase().includes(normalizedKeyword)

    return matchesCategory && matchesKeyword
  })
})

onMounted(refreshPosts)
</script>

<template>
  <div class="container page-stack">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Anonymous Community</p>
        <h1>서울 커뮤니티</h1>
      </div>
      <RouterLink class="button button-primary" :to="{ name: ROUTE_NAMES.POST_CREATE }">
        글쓰기
      </RouterLink>
    </div>

    <section class="filter-bar" aria-label="게시글 검색 및 필터">
      <input v-model="keyword" class="text-input" placeholder="제목 또는 내용 검색" />
      <select v-model="selectedCategory" class="text-input">
        <option value="all">전체 카테고리</option>
        <option value="free">자유</option>
        <option value="travel">관광</option>
        <option value="food">맛집</option>
        <option value="festival">축제</option>
      </select>
    </section>

    <div v-if="filteredPosts.length" class="card-list">
      <PostCard v-for="post in filteredPosts" :key="post.id" :post="post" />
    </div>
    <EmptyState
      v-else
      title="조건에 맞는 게시글이 없습니다."
      description="검색어를 바꾸거나 새 게시글을 작성해 주세요."
    />
  </div>
</template>
