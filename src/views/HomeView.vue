<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useFavorites } from '@/composables/useFavorites'
import { useLocale } from '@/composables/useLocale'
import { usePosts } from '@/composables/usePosts'
import { ROUTE_NAMES } from '@/constants/routes'
import {
  getContentTypeOptions,
  getFestivalItems,
  getRegionItems,
} from '@/services/regionDataService'
import { localizeRegionItem } from '@/services/localizationService'
import { getPostCommentCount } from '@/services/postStorageService'
import { getSeoulWeather } from '@/services/weatherService'

const { favorites } = useFavorites()
const { locale } = useLocale()
const { posts, refreshPosts } = usePosts()
const weather = ref(null)
const weatherError = ref('')
const isWeatherLoading = ref(false)
const weatherController = new AbortController()
const regionItems = getRegionItems()
const contentTypes = getContentTypeOptions()

const copy = computed(() => locale.value === 'en'
  ? {
      eyebrow: 'TODAY IN SEOUL',
      title: 'Your Seoul dashboard',
      description: 'See today’s local activity and plan your next outing.',
      weather: 'Seoul weather',
      ongoing: 'Ongoing festivals',
      thisWeek: 'Starting this week',
      favorites: 'My activity',
      saved: 'Saved places',
      savedFestivals: 'Saved festivals',
      recentSaved: 'Recently saved',
      viewFavorites: 'View favorites',
      timeline: 'This Month’s Festival Timeline',
      timelineDescription: 'Festivals taking place in July.',
      viewCalendar: 'View calendar',
      exploration: 'Explore Seoul',
      explorationDescription: 'Browse the city by place category.',
      places: 'places',
      popular: 'Popular local picks TOP 5',
      popularDescription: 'Demo ranking based on curated favorite counts.',
      favoritesUnit: 'favorites',
      noFavorites: 'Save places you want to visit, and they will appear here.',
      weatherUnavailable: 'Weather unavailable',
      retry: 'Retry',
      feelsLike: 'Feels like',
    }
  : {
      eyebrow: 'TODAY IN SEOUL',
      title: '오늘의 서울 대시보드',
      description: '지금 서울의 활동과 내 저장 목록을 한눈에 확인하세요.',
      weather: '서울 날씨',
      ongoing: '진행 중 축제',
      thisWeek: '이번 주 시작',
      favorites: '내 활동 요약',
      saved: '찜한 장소',
      savedFestivals: '찜한 축제',
      recentSaved: '최근 찜',
      viewFavorites: '찜 목록 보기',
      timeline: '이번 달 축제 타임라인',
      timelineDescription: '7월에 열리는 축제 일정입니다.',
      viewCalendar: '축제 달력 보기',
      exploration: '지역 탐색',
      explorationDescription: '장소 종류별 데이터 갯수입니다. 서울을 탐색해 보세요.',
      places: '개 장소',
      popular: '찜목록 TOP 5',
      popularDescription: '카테고리별 임의 찜 수를 반영한 데모 인기 순위입니다.',
      favoritesUnit: '찜',
      noFavorites: '가고 싶은 장소를 찜하면 이곳에 최근 저장 목록이 표시됩니다.',
      weatherUnavailable: '날씨 정보 없음',
      retry: '다시 시도',
      feelsLike: '체감',
    })

function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const todayKey = computed(() => formatDateKey(new Date()))
const weekEndKey = computed(() => {
  const weekEnd = new Date()
  weekEnd.setDate(weekEnd.getDate() + 6)
  return formatDateKey(weekEnd)
})
const timelineMonthRange = computed(() => {
  const today = new Date()
  const year = today.getFullYear()
  const month = 6

  return {
    start: `${year}-${String(month + 1).padStart(2, '0')}-01`,
    end: `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, '0')}`,
  }
})
const availableFestivals = getFestivalItems()
const ongoingFestivalCount = computed(() => availableFestivals.filter(
  (festival) => festival.startDate <= todayKey.value && festival.endDate >= todayKey.value
).length)
const weeklyFestivalCount = computed(() => availableFestivals.filter(
  (festival) => festival.startDate >= todayKey.value && festival.startDate <= weekEndKey.value
).length)
const festivalTimeline = computed(() => availableFestivals
  .filter((festival) =>
    festival.startDate <= timelineMonthRange.value.end && festival.endDate >= timelineMonthRange.value.start
  )
  .sort((left, right) => left.startDate.localeCompare(right.startDate))
  .slice(0, 4)
  .map((festival) => localizeRegionItem(festival, locale.value)))

const favoriteSummary = computed(() => ({
  total: favorites.value.length,
  festivals: favorites.value.filter((favorite) => favorite.type === 'festival').length,
  recent: [...favorites.value]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 2)
    .map((favorite) => localizeRegionItem(favorite, locale.value)),
}))

const categoryExploration = computed(() => {
  const categories = contentTypes.map((category) => ({
    ...category,
    count: regionItems.filter((item) => item.categoryCode === category.code).length,
  }))
  const maxCount = Math.max(...categories.map((category) => category.count), 1)

  return categories.map((category) => ({
    ...category,
    localizedName: locale.value === 'en'
      ? localizeRegionItem({ category: category.name }, 'en').category
      : category.name,
    ratio: `${Math.round((category.count / maxCount) * 100)}%`,
  }))
})

const popularityScores = Object.freeze([1284, 1124, 967, 854, 781])
const popularPlaces = computed(() => {
  const candidates = ['15', '14', '25'].flatMap((categoryCode) => regionItems
    .filter((item) => item.categoryCode === categoryCode && item.imageUrl)
    .slice(0, 2))

  return candidates.slice(0, 5).map((place, index) => ({
    ...localizeRegionItem(place, locale.value),
    rank: index + 1,
    favoriteCount: popularityScores[index],
  }))
})

const communityActivity = computed(() => ({
  posts: posts.value.length,
  comments: posts.value.reduce((count, post) => count + getPostCommentCount(post), 0),
}))

async function loadWeather() {
  if (isWeatherLoading.value) return

  isWeatherLoading.value = true
  weatherError.value = ''

  try {
    weather.value = await getSeoulWeather({ signal: weatherController.signal })
  } catch (error) {
    if (error.name !== 'AbortError') {
      weatherError.value = copy.value.weatherUnavailable
    }
  } finally {
    isWeatherLoading.value = false
  }
}

function refreshWeatherWhenVisible() {
  if (document.visibilityState === 'visible') loadWeather()
}

onMounted(() => {
  refreshPosts()
  loadWeather()
  document.addEventListener('visibilitychange', refreshWeatherWhenVisible)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', refreshWeatherWhenVisible)
  weatherController.abort()
})
</script>

<template>
  <div class="container page-stack dashboard-page">
    <section class="dashboard-heading">
      <div>
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h1>{{ copy.title }}</h1>
        <p>{{ copy.description }}</p>
      </div>
      <RouterLink class="button button-secondary" :to="{ name: ROUTE_NAMES.MAP }">
        {{ locale === 'en' ? 'Explore map' : '지도 탐색' }}
      </RouterLink>
    </section>

    <section class="dashboard-today-grid" :aria-label="copy.eyebrow">
      <article class="weather-card dashboard-weather-card" aria-live="polite">
        <div class="weather-card-heading">
          <div>
            <p class="eyebrow">{{ copy.weather }}</p>
            <h2>{{ weather?.label || copy.weather }}</h2>
          </div>
          <span v-if="weather" class="weather-icon" aria-hidden="true">{{ weather.icon }}</span>
        </div>
        <div v-if="isWeatherLoading" class="weather-state">{{ locale === 'en' ? 'Loading weather…' : '날씨 정보를 불러오는 중입니다.' }}</div>
        <div v-else-if="weatherError" class="weather-state weather-error">
          <p>{{ weatherError }}</p>
          <button type="button" class="button button-ghost" @click="loadWeather">{{ copy.retry }}</button>
        </div>
        <template v-else-if="weather">
          <div class="weather-current">
            <strong>{{ weather.temperature }}°</strong>
            <div>
              <b>{{ weather.label }}</b>
              <span>{{ copy.feelsLike }} {{ weather.apparentTemperature }}°</span>
            </div>
          </div>
          <div class="weather-details">
            <div><span>{{ locale === 'en' ? 'High / Low' : '최고 / 최저' }}</span><strong>{{ weather.maximumTemperature }}° / {{ weather.minimumTemperature }}°</strong></div>
            <div><span>{{ locale === 'en' ? 'Rain chance' : '강수확률' }}</span><strong>{{ weather.precipitationProbability }}%</strong></div>
          </div>
        </template>
      </article>

      <RouterLink class="dashboard-stat-card is-festival" :to="{ name: ROUTE_NAMES.FESTIVALS }">
        <span>{{ copy.ongoing }}</span>
        <strong>{{ ongoingFestivalCount }}</strong>
        <small>{{ locale === 'en' ? 'View the festival calendar →' : '축제 달력에서 보기 →' }}</small>
      </RouterLink>
      <RouterLink class="dashboard-stat-card is-week" :to="{ name: ROUTE_NAMES.FESTIVALS }">
        <span>{{ copy.thisWeek }}</span>
        <strong>{{ weeklyFestivalCount }}</strong>
        <small>{{ locale === 'en' ? 'Within the next 7 days' : '앞으로 7일 안에 시작' }}</small>
      </RouterLink>
      <RouterLink class="dashboard-stat-card is-community" :to="{ name: ROUTE_NAMES.POSTS }">
        <span>{{ locale === 'en' ? 'Community activity' : '커뮤니티 활동' }}</span>
        <strong>{{ communityActivity.comments }}</strong>
        <small>{{ locale === 'en' ? `${communityActivity.posts} posts` : `게시글 ${communityActivity.posts}개` }}</small>
      </RouterLink>
    </section>

    <section class="dashboard-content-grid">
      <article class="dashboard-panel dashboard-activity-panel">
        <div class="dashboard-panel-heading">
          <div><p class="eyebrow">MY LOCALHUB</p><h2>{{ copy.favorites }}</h2></div>
          <RouterLink :to="{ name: ROUTE_NAMES.FAVORITES }">{{ copy.viewFavorites }} →</RouterLink>
        </div>
        <div class="dashboard-activity-counts">
          <div><span>{{ copy.saved }}</span><strong>{{ favoriteSummary.total }}</strong></div>
          <div><span>{{ copy.savedFestivals }}</span><strong>{{ favoriteSummary.festivals }}</strong></div>
        </div>
        <div v-if="favoriteSummary.recent.length" class="dashboard-recent-favorites">
          <RouterLink
            v-for="favorite in favoriteSummary.recent"
            :key="favorite.key"
            :to="favorite.type === 'festival' ? { name: ROUTE_NAMES.FESTIVALS } : { name: ROUTE_NAMES.MAP, query: { place: favorite.id } }"
          >
            <img v-if="favorite.imageUrl" :src="favorite.imageUrl" :alt="favorite.name" />
            <span v-else class="dashboard-image-empty">{{ locale === 'en' ? 'No image' : '이미지 없음' }}</span>
            <span><small>{{ favorite.category }}</small><b>{{ favorite.name }}</b></span>
          </RouterLink>
        </div>
        <p v-else class="dashboard-empty-text">{{ copy.noFavorites }}</p>
      </article>

      <article class="dashboard-panel dashboard-timeline-panel">
        <div class="dashboard-panel-heading">
          <div><p class="eyebrow">NEXT UP</p><h2>{{ copy.timeline }}</h2></div>
          <RouterLink :to="{ name: ROUTE_NAMES.FESTIVALS }">{{ copy.viewCalendar }} →</RouterLink>
        </div>
        <ol class="dashboard-timeline-list">
          <li v-for="festival in festivalTimeline" :key="festival.id">
            <time class="dashboard-timeline-dates" :datetime="festival.startDate">
              <span>{{ festival.startDate }}</span>
              <span>- {{ festival.endDate }}</span>
            </time>
            <RouterLink :to="{ name: ROUTE_NAMES.MAP, query: { place: festival.id } }">
              <span>{{ festival.districtName || (locale === 'en' ? 'Seoul' : '서울') }}</span>
              <strong>{{ festival.name }}</strong>
            </RouterLink>
          </li>
        </ol>
      </article>
    </section>

    <section class="dashboard-panel">
      <div class="dashboard-panel-heading">
        <div><p class="eyebrow">EXPLORE BY CATEGORY</p><h2>{{ copy.exploration }}</h2><p>{{ copy.explorationDescription }}</p></div>
        <RouterLink :to="{ name: ROUTE_NAMES.MAP }">{{ locale === 'en' ? 'Open map' : '지도 열기' }} →</RouterLink>
      </div>
      <div class="dashboard-category-grid">
        <RouterLink
          v-for="category in categoryExploration"
          :key="category.code"
          :to="{ name: ROUTE_NAMES.MAP, query: { category: category.code } }"
        >
          <div><span :style="{ backgroundColor: category.color }"></span><strong>{{ category.localizedName }}</strong><b>{{ category.count }}</b></div>
          <i><i :style="{ width: category.ratio, backgroundColor: category.color }"></i></i>
        </RouterLink>
      </div>
    </section>

    <section class="dashboard-panel">
      <div class="dashboard-panel-heading">
        <div><p class="eyebrow">LOCAL TOP 5</p><h2>{{ copy.popular }}</h2><p>{{ copy.popularDescription }}</p></div>
      </div>
      <ol class="dashboard-popular-list">
        <li v-for="place in popularPlaces" :key="place.id">
          <span class="dashboard-rank">{{ place.rank }}</span>
          <img v-if="place.imageUrl" :src="place.imageUrl" :alt="place.name" />
          <span v-else class="dashboard-image-empty">{{ locale === 'en' ? 'No image' : '이미지 없음' }}</span>
          <RouterLink :to="{ name: ROUTE_NAMES.MAP, query: { place: place.id } }">
            <small>{{ place.category }} · {{ place.districtName || (locale === 'en' ? 'Seoul' : '서울') }}</small>
            <strong>{{ place.name }}</strong>
          </RouterLink>
          <b>{{ place.favoriteCount.toLocaleString() }} <small>{{ copy.favoritesUnit }}</small></b>
        </li>
      </ol>
    </section>
  </div>
</template>
