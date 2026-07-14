<script setup>
import { computed, onMounted } from 'vue'
import EmptyState from '@/components/common/EmptyState.vue'
import PostCard from '@/components/community/PostCard.vue'
import { usePosts } from '@/composables/usePosts'
import { SELECTED_REGION } from '@/constants/region'
import { ROUTE_NAMES } from '@/constants/routes'
import { getRegionItems } from '@/services/regionDataService'

const { posts, refreshPosts } = usePosts()
const regionItemCount = getRegionItems().length
const recentPosts = computed(() => posts.value.slice(0, 3))

onMounted(refreshPosts)
</script>

<template>
  <div class="container page-stack">
    <section class="hero-card">
      <p class="eyebrow">공공데이터 기반 지역정보 커뮤니티</p>
      <h1>{{ SELECTED_REGION.name }} LocalHub</h1>
      <p>{{ SELECTED_REGION.description }}</p>
      <div class="button-row">
        <RouterLink class="button button-primary" :to="{ name: ROUTE_NAMES.POSTS }">
          커뮤니티 보기
        </RouterLink>
        <RouterLink class="button button-secondary" :to="{ name: ROUTE_NAMES.MAP }">
          지역정보 보기
        </RouterLink>
      </div>
    </section>

    <section class="metric-grid" aria-label="서비스 현황">
      <article class="metric-card">
        <strong>{{ regionItemCount }}</strong>
        <span>샘플 지역정보</span>
      </article>
      <article class="metric-card">
        <strong>{{ posts.length }}</strong>
        <span>현재 브라우저 게시글</span>
      </article>
      <article class="metric-card">
        <strong>1</strong>
        <span>선정 권역</span>
      </article>
    </section>

    <section>
      <div class="section-heading">
        <div>
          <p class="eyebrow">Community</p>
          <h2>최근 게시글</h2>
        </div>
        <RouterLink :to="{ name: ROUTE_NAMES.POSTS }">전체 보기</RouterLink>
      </div>

      <div v-if="recentPosts.length" class="card-list">
        <PostCard v-for="post in recentPosts" :key="post.id" :post="post" />
      </div>
      <EmptyState
        v-else
        title="아직 게시글이 없습니다."
        description="첫 번째 지역정보를 커뮤니티에 공유해 보세요."
      />
    </section>
  </div>
</template>
