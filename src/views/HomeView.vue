<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import EmptyState from '@/components/common/EmptyState.vue'
import PostCard from '@/components/community/PostCard.vue'
import { usePosts } from '@/composables/usePosts'
import { SELECTED_REGION } from '@/constants/region'
import { ROUTE_NAMES } from '@/constants/routes'
import { getFestivalItemsForDate, getRegionItems } from '@/services/regionDataService'
import { getSeoulWeather } from '@/services/weatherService'

const { posts, refreshPosts } = usePosts()
const regionItemCount = getRegionItems().length
const todayFestivalCount = getFestivalItemsForDate().length
const recentPosts = computed(() => posts.value.slice(0, 3))
const weather = ref(null)
const weatherError = ref('')
const isWeatherLoading = ref(false)
const weatherController = new AbortController()

async function loadWeather() {
  isWeatherLoading.value = true
  weatherError.value = ''

  try {
    weather.value = await getSeoulWeather({ signal: weatherController.signal })
  } catch (error) {
    if (error.name !== 'AbortError') {
      weatherError.value = error.message || '날씨 정보를 불러오지 못했습니다.'
    }
  } finally {
    isWeatherLoading.value = false
  }
}

onMounted(() => {
  refreshPosts()
  loadWeather()
})

onUnmounted(() => weatherController.abort())
</script>

<template>
  <div class="container page-stack">
    <section class="home-hero-grid">
      <div class="hero-card home-intro-card">
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
      </div>

      <article class="weather-card" aria-live="polite">
        <div class="weather-card-heading">
          <div>
            <p class="eyebrow">Seoul Weather</p>
            <h2>서울의 오늘 날씨</h2>
          </div>
          <span v-if="weather" class="weather-icon" aria-hidden="true">{{ weather.icon }}</span>
        </div>

        <div v-if="isWeatherLoading" class="weather-state">날씨 정보를 불러오는 중입니다.</div>
        <div v-else-if="weatherError" class="weather-state weather-error">
          <p>{{ weatherError }}</p>
          <button type="button" class="button button-ghost" @click="loadWeather">다시 시도</button>
        </div>
        <template v-else-if="weather">
          <div class="weather-current">
            <strong>{{ weather.temperature }}°</strong>
            <div>
              <b>{{ weather.label }}</b>
              <span>체감 {{ weather.apparentTemperature }}°</span>
            </div>
          </div>
          <div class="weather-details">
            <div><span>최고 / 최저</span><strong>{{ weather.maximumTemperature }}° / {{ weather.minimumTemperature }}°</strong></div>
            <div><span>습도</span><strong>{{ weather.humidity }}%</strong></div>
            <div><span>바람</span><strong>{{ weather.windSpeed }} km/h</strong></div>
            <div><span>강수확률</span><strong>{{ weather.precipitationProbability }}%</strong></div>
          </div>
          <small class="weather-source">
            {{ weather.observedAt.replace('T', ' ') }} 기준 ·
            <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>
          </small>
        </template>
      </article>
    </section>

    <section class="metric-grid" aria-label="서비스 현황">
      <article class="metric-card">
        <strong>{{ regionItemCount }}</strong>
        <span>지역정보</span>
      </article>
      <article class="metric-card">
        <strong>{{ posts.length }}</strong>
        <span>현재 브라우저 게시글</span>
      </article>
      <article class="metric-card">
        <strong>{{ todayFestivalCount }}</strong>
        <span>오늘의 축제·행사</span>
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
