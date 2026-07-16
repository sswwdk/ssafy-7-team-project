<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { ROUTE_NAMES } from '@/constants/routes'
import { searchRegionData } from '@/services/regionDataService'

defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-theme'])

const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchContainer = ref(null)
const searchInput = ref(null)

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []

  return searchRegionData(searchQuery.value, 50)
    .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
    .slice(0, 10)
})

async function toggleSearch() {
  isSearchOpen.value = !isSearchOpen.value

  if (isSearchOpen.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}

function closeSearch(clearQuery = false) {
  isSearchOpen.value = false

  if (clearQuery) {
    searchQuery.value = ''
  }
}

function handleDocumentPointerDown(event) {
  if (isSearchOpen.value && !searchContainer.value?.contains(event.target)) {
    closeSearch()
  }
}

function handleDocumentKeydown(event) {
  if (event.key === 'Escape') {
    closeSearch()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  document.addEventListener('keydown', handleDocumentKeydown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  document.removeEventListener('keydown', handleDocumentKeydown)
})
</script>

<template>
  <header class="app-header">
    <div class="container header-inner">
      <RouterLink class="brand" :to="{ name: ROUTE_NAMES.HOME }">LocalHub</RouterLink>
      <nav class="main-nav" aria-label="주요 메뉴">
        <RouterLink :to="{ name: ROUTE_NAMES.HOME }">메인</RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.DASHBOARD }">대시보드</RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.POSTS }">커뮤니티</RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.MAP }">지도</RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.FESTIVALS }">축제</RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.FAVORITES }">찜 목록</RouterLink>
        <button
          type="button"
          class="theme-toggle-button"
          :aria-label="isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'"
          :aria-pressed="isDarkMode"
          @click="$emit('toggle-theme')"
        >
          <span aria-hidden="true">{{ isDarkMode ? '☀️' : '🌙' }}</span>
          <span class="theme-toggle-label">{{ isDarkMode ? '라이트 모드' : '다크 모드' }}</span>
        </button>
        <div ref="searchContainer" class="global-search">
          <button
            type="button"
            class="global-search-button"
            :aria-label="isSearchOpen ? '통합 검색 닫기' : '통합 검색 열기'"
            :aria-expanded="isSearchOpen"
            aria-controls="global-search-panel"
            @click="toggleSearch"
          >
            <span aria-hidden="true">⌕</span>
            <span class="global-search-label">통합 검색</span>
          </button>

          <section
            v-if="isSearchOpen"
            id="global-search-panel"
            class="global-search-panel"
            aria-label="서울 장소 통합 검색"
          >
            <div class="global-search-heading">
              <div>
                <strong>통합 검색</strong>
              </div>
              <button type="button" aria-label="통합 검색 닫기" @click="closeSearch()">×</button>
            </div>

            <label class="sr-only" for="global-search-input">장소 검색어</label>
            <input
              id="global-search-input"
              ref="searchInput"
              v-model="searchQuery"
              class="text-input global-search-input"
              type="search"
              autocomplete="off"
              placeholder="장소명, 주소, 지역, 종류 검색"
            />

            <p v-if="!searchQuery.trim()" class="global-search-guide">
              찾고 싶은 장소나 지역을 입력해 주세요.
            </p>
            <ul v-else-if="searchResults.length" class="global-search-results">
              <li v-for="item in searchResults" :key="item.id">
                <RouterLink
                  :to="{ name: ROUTE_NAMES.MAP, query: { place: item.id } }"
                  @click="closeSearch(true)"
                >
                  <strong>{{ item.name }}</strong>
                  <span>{{ item.category }}<template v-if="item.districtName"> · {{ item.districtName }}</template></span>
                  <small>{{ item.address || '주소 정보 없음' }}</small>
                </RouterLink>
              </li>
            </ul>
            <p v-else class="global-search-guide">일치하는 장소가 없습니다.</p>
          </section>
        </div>
      </nav>
    </div>
  </header>
</template>
