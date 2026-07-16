<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { ROUTE_NAMES } from '@/constants/routes'
import {
  getContentTypeOptions,
  getFestivalItems,
  getFestivalItemsForMonth,
  getMapItems,
  searchRegionData
} from '@/services/regionDataService'
import { localizeRegionItem } from '@/services/localizationService'
import { formatDate } from '@/utils/date'

const router = useRouter()
const { locale, t } = useLocale()
const localized = (item) => localizeRegionItem(item, locale.value)
const searchQuery = ref('')
const mapItems = getMapItems('', '')
const contentTypeOptions = getContentTypeOptions()
const categoryIcons = Object.freeze({
  12: '🏛️',
  14: '🎨',
  15: '🎉',
  25: '🧭',
  28: '🚴',
  32: '🛏️',
  38: '🛍️'
})

const categoryCards = contentTypeOptions.map((category) => ({
  ...category,
  icon: categoryIcons[category.code] || '📍',
  count: mapItems.filter((item) => item.categoryCode === category.code).length
}))

const imageItems = mapItems.filter((item) => item.imageUrl)
const featuredPlaces = contentTypeOptions
  .map((category) => imageItems.find((item) => item.categoryCode === category.code))
  .filter(Boolean)
  .slice(0, 6)
const heroSlideNames = Object.freeze([
  '청계천',
  '경복궁',
  '롯데월드타워 서울스카이',
  '국립중앙박물관',
  '서울숲'
])
const heroSlides = heroSlideNames
  .map((name) => mapItems.find((item) => item.name === name))
  .filter(Boolean)
const activeHeroSlideIndex = ref(0)
const heroPlace = computed(
  () => localized(heroSlides[activeHeroSlideIndex.value] || featuredPlaces[0] || imageItems[0] || mapItems[0])
)
const thisMonthFestivals = getFestivalItemsForMonth(new Date()).filter((item) => item.imageUrl)
const festivalHighlights = (
  thisMonthFestivals.length ? thisMonthFestivals : getFestivalItems().filter((item) => item.imageUrl)
).slice(0, 4)
const festivalSectionTitle = computed(() => {
  if (!thisMonthFestivals.length) return t('서울에서 만나는 추천 축제')

  const month = new Date().getMonth() + 1
  return locale.value === 'en' ? `Seoul festivals in ${month}` : `${month}월에 만나는 서울 축제`
})

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []

  return searchRegionData(searchQuery.value, 30)
    .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
    .slice(0, 6)
    .map(localized)
})
let heroSlideTimer = null

function stopHeroSlider() {
  window.clearInterval(heroSlideTimer)
  heroSlideTimer = null
}

function startHeroSlider() {
  stopHeroSlider()

  if (heroSlides.length > 1) {
    heroSlideTimer = window.setInterval(() => {
      activeHeroSlideIndex.value = (activeHeroSlideIndex.value + 1) % heroSlides.length
    }, 4500)
  }
}

function selectHeroSlide(index) {
  activeHeroSlideIndex.value = index
  startHeroSlider()
}

function changeHeroSlide(offset) {
  activeHeroSlideIndex.value =
    (activeHeroSlideIndex.value + offset + heroSlides.length) % heroSlides.length
  startHeroSlider()
}

function submitSearch() {
  const firstResult = searchResults.value[0]

  if (firstResult) {
    router.push({ name: ROUTE_NAMES.MAP, query: { place: firstResult.id } })
  }
}

function useKeyword(keyword) {
  searchQuery.value = keyword
}

onMounted(startHeroSlider)
onUnmounted(stopHeroSlider)
</script>

<template>
  <div class="container landing-page">
    <section class="landing-hero">
      <div class="landing-hero-content">
        <span class="landing-kicker">SEOUL LOCAL DISCOVERY</span>
        <h1>{{ t('오늘의 서울을') }}<br />{{ t('내 취향대로') }}<br />{{ t('발견하세요') }}</h1>
        <p>{{ t('관광지부터 축제, 문화시설, 산책 코스까지 서울의 다채로운 장소를 한 번에 찾아보세요.') }}</p>

        <div class="landing-search-wrap">
          <form class="landing-search" role="search" @submit.prevent="submitSearch">
            <span aria-hidden="true">⌕</span>
            <label class="sr-only" for="landing-search-input">{{ t('서울 장소 검색') }}</label>
            <input
              id="landing-search-input"
              v-model="searchQuery"
              type="search"
              autocomplete="off"
              :placeholder="t('어디로 떠나고 싶으세요?')"
            />
            <button type="submit" :disabled="!searchResults.length">{{ t('검색') }}</button>
          </form>

          <ul v-if="searchQuery.trim()" class="landing-search-results">
            <li v-for="item in searchResults" :key="item.id">
              <RouterLink :to="{ name: ROUTE_NAMES.MAP, query: { place: item.id } }">
                <span class="landing-result-icon" :style="{ backgroundColor: item.markerColor }">
                  {{ categoryIcons[item.categoryCode] || '📍' }}
                </span>
                <span>
                  <strong>{{ item.name }}</strong>
                  <small>{{ t(item.category) }} · {{ item.districtName || t('서울') }}</small>
                </span>
              </RouterLink>
            </li>
            <li v-if="!searchResults.length" class="landing-search-empty">
              {{ t('일치하는 장소가 없습니다.') }}
            </li>
          </ul>
        </div>

        <div class="landing-keywords" aria-label="추천 검색어">
          <span>{{ t('추천') }}</span>
          <button type="button" @click="useKeyword(locale === 'en' ? 'Gyeongbokgung Palace' : '경복궁')">{{ locale === 'en' ? 'Gyeongbokgung Palace' : '경복궁' }}</button>
          <button type="button" @click="useKeyword(locale === 'en' ? 'Han River' : '한강')">{{ locale === 'en' ? 'Han River' : '한강' }}</button>
          <button type="button" @click="useKeyword(locale === 'en' ? 'Festivals' : '축제')">{{ t('축제') }}</button>
        </div>
      </div>

      <div
        v-if="heroPlace"
        class="landing-hero-visual"
        @mouseenter="stopHeroSlider"
        @mouseleave="startHeroSlider"
      >
        <Transition name="hero-slide-fade" mode="out-in">
          <RouterLink
            :key="heroPlace.id"
            class="landing-hero-slide"
            :to="{ name: ROUTE_NAMES.MAP, query: { place: heroPlace.id } }"
          >
            <img
              v-if="heroPlace.largeImageUrl || heroPlace.imageUrl"
              :src="heroPlace.largeImageUrl || heroPlace.imageUrl"
              :alt="heroPlace.name"
            />
            <div class="landing-hero-caption">
              <span>{{ t(heroPlace.category) }} · {{ heroPlace.districtName || t('서울') }}</span>
              <strong>{{ heroPlace.name }}</strong>
              <small>{{ t('지도에서 확인하기 →') }}</small>
            </div>
          </RouterLink>
        </Transition>

        <template v-if="heroSlides.length > 1">
          <button
            type="button"
            class="landing-slider-arrow is-previous"
            :aria-label="t('이전 추천 장소')"
            @click="changeHeroSlide(-1)"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            class="landing-slider-arrow is-next"
            :aria-label="t('다음 추천 장소')"
            @click="changeHeroSlide(1)"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
          <div class="landing-slider-dots" :aria-label="t('추천 장소 선택')">
            <button
              v-for="(slide, index) in heroSlides"
              :key="slide.id"
              type="button"
              :class="{ 'is-active': activeHeroSlideIndex === index }"
              :aria-label="locale === 'en' ? `View ${localized(slide).name}` : `${slide.name} 보기`"
              :aria-pressed="activeHeroSlideIndex === index"
              @click="selectHeroSlide(index)"
            ></button>
          </div>
        </template>
      </div>
    </section>

    <section class="landing-section" aria-labelledby="category-heading">
      <div class="landing-section-heading">
        <div>
          <p class="eyebrow">Explore by category</p>
          <h2 id="category-heading">{{ t('어떤 서울을 찾고 있나요?') }}</h2>
        </div>
      </div>
      <div class="landing-category-grid">
        <RouterLink
          v-for="category in categoryCards"
          :key="category.code"
          class="landing-category-card"
          :to="{ name: ROUTE_NAMES.MAP, query: { category: category.code } }"
        >
          <span class="landing-category-icon" :style="{ backgroundColor: `${category.color}22` }">
            {{ category.icon }}
          </span>
          <strong>{{ t(category.name) }}</strong>
          <small>{{ locale === 'en' ? `${category.count} places` : `${category.count}곳` }}</small>
        </RouterLink>
      </div>
    </section>

    <section v-if="featuredPlaces.length" class="landing-section" aria-labelledby="place-heading">
      <div class="landing-section-heading">
        <div>
          <p class="eyebrow">Local picks</p>
          <h2 id="place-heading">{{ t('서울에서 발견한 추천 장소') }}</h2>
        </div>
        <RouterLink :to="{ name: ROUTE_NAMES.MAP }">{{ t('전체 장소 보기 →') }}</RouterLink>
      </div>
      <div class="landing-place-grid">
        <RouterLink
          v-for="place in featuredPlaces"
          :key="place.id"
          class="landing-place-card"
          :to="{ name: ROUTE_NAMES.MAP, query: { place: place.id } }"
        >
          <div class="landing-place-image">
            <img :src="place.imageUrl" :alt="localized(place).name" loading="lazy" />
            <span>{{ localized(place).category }}</span>
          </div>
          <div>
            <small>{{ localized(place).districtName || t('서울') }}</small>
            <strong>{{ localized(place).name }}</strong>
            <p>{{ localized(place).address || (locale === 'en' ? 'Seoul' : '서울특별시') }}</p>
          </div>
        </RouterLink>
      </div>
    </section>

    <section v-if="festivalHighlights.length" class="landing-section" aria-labelledby="festival-heading">
      <div class="landing-section-heading">
        <div>
          <p class="eyebrow">Festival now</p>
          <h2 id="festival-heading">{{ festivalSectionTitle }}</h2>
        </div>
        <RouterLink :to="{ name: ROUTE_NAMES.FESTIVALS }">{{ t('축제 달력 보기 →') }}</RouterLink>
      </div>
      <div class="landing-festival-grid">
        <RouterLink
          v-for="festival in festivalHighlights"
          :key="festival.id"
          class="landing-festival-card"
          :to="{ name: ROUTE_NAMES.MAP, query: { place: festival.id } }"
        >
          <img :src="festival.imageUrl" :alt="localized(festival).name" loading="lazy" />
          <div>
            <span>{{ localized(festival).districtName || t('서울') }}</span>
            <strong>{{ localized(festival).name }}</strong>
            <small>{{ formatDate(festival.startDate) }} ~ {{ formatDate(festival.endDate) }}</small>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="landing-community-cta">
      <div>
        <p class="eyebrow">Travel together</p>
        <h2>{{ t('서울 이야기를 함께 나눠보세요') }}</h2>
        <p>{{ t('나만의 장소 추천과 축제 후기를 공유하고, 다른 여행자의 생생한 댓글을 확인해 보세요.') }}</p>
      </div>
      <RouterLink class="button button-primary" :to="{ name: ROUTE_NAMES.POSTS }">
        {{ t('커뮤니티 둘러보기') }}
      </RouterLink>
    </section>
  </div>
</template>
