<script setup>
import { computed, nextTick, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import EmptyState from '@/components/common/EmptyState.vue'
import { useFavorites } from '@/composables/useFavorites'
import { getContentTypeOptions, getDistrictOptions, getMapItems } from '@/services/regionDataService'

const mapContainer = ref(null)
const mapSection = ref(null)
const mapError = ref('')
const route = useRoute()
const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY?.trim()
const selectedDistrictCodes = ref([])
const selectedCategoryCodes = ref([])
const isAllCategoriesSelected = ref(false)
const searchQuery = ref('')
const listViewMode = ref('card')
const failedImageIds = ref(new Set())
const districtOptions = getDistrictOptions()
const contentTypeOptions = getContentTypeOptions()
const { isFavorite, toggleFavorite } = useFavorites()
const mapItems = computed(() => {
  if (!isAllCategoriesSelected.value && !selectedCategoryCodes.value.length) {
    return []
  }

  return getMapItems(selectedDistrictCodes.value.join(','), selectedCategoryCodes.value.join(','))
})
const filteredMapItems = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  if (!keyword) {
    return mapItems.value
  }

  return mapItems.value.filter((item) =>
    [item.name, item.address, item.districtName, item.category]
      .some((value) => String(value || '').toLowerCase().includes(keyword))
  )
})
const MARKER_VERTICAL_OFFSET = 90
const districtCenterMap = Object.freeze({
  110: { lat: 37.5704, lng: 126.9820 },
  140: { lat: 37.5637, lng: 126.9955 },
  170: { lat: 37.5290, lng: 126.9800 },
  200: { lat: 37.5500, lng: 127.0407 },
  215: { lat: 37.5380, lng: 127.0820 },
  230: { lat: 37.5744, lng: 127.0390 },
  260: { lat: 37.5980, lng: 127.0920 },
  290: { lat: 37.5890, lng: 127.0160 },
  305: { lat: 37.6398, lng: 127.0250 },
  320: { lat: 37.6688, lng: 127.0470 },
  350: { lat: 37.6542, lng: 127.0560 },
  380: { lat: 37.6025, lng: 126.9290 },
  410: { lat: 37.5658, lng: 126.9368 },
  440: { lat: 37.5660, lng: 126.9010 },
  470: { lat: 37.5175, lng: 126.8660 },
  500: { lat: 37.5509, lng: 126.8495 },
  530: { lat: 37.4952, lng: 126.8870 },
  545: { lat: 37.4567, lng: 126.8950 },
  560: { lat: 37.5261, lng: 126.8960 },
  590: { lat: 37.5124, lng: 126.9390 },
  620: { lat: 37.4654, lng: 126.9430 },
  650: { lat: 37.4836, lng: 127.0328 },
  680: { lat: 37.4959, lng: 127.0667 },
  710: { lat: 37.5146, lng: 127.1050 },
  740: { lat: 37.5300, lng: 127.1230 },
})
let mapInstance = null
let kakaoMapsApi = null
let markers = []
let activeInfoWindow = null
let markerStates = {}
const markerImageCache = new Map()

function markImageAsFailed(itemId) {
  failedImageIds.value = new Set([...failedImageIds.value, itemId])
}

function createCategoryMarkerImage(kakao, item) {
  if (markerImageCache.has(item.categoryCode)) {
    return markerImageCache.get(item.categoryCode)
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <path fill="${item.markerColor}" stroke="${item.markerStrokeColor}" stroke-width="1.5" d="M14 1.5c-5.2 0-9.5 4.3-9.5 9.5 0 7.1 9.5 15 9.5 15s9.5-7.9 9.5-15C23.5 5.8 19.2 1.5 14 1.5z"/>
      <circle cx="14" cy="11" r="3.8" fill="#FFFFFF" fill-opacity="0.78"/>
    </svg>
  `
  const encoded = encodeURIComponent(svg)

  const markerImage = new kakao.maps.MarkerImage(
    `data:image/svg+xml;charset=utf-8,${encoded}`,
    new kakao.maps.Size(24, 28),
    {
      offset: new kakao.maps.Point(12, 28),
    }
  )

  markerImageCache.set(item.categoryCode, markerImage)
  return markerImage
}

function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null))
  markers = []
  markerStates = {}

  if (activeInfoWindow) {
    activeInfoWindow.close()
    activeInfoWindow = null
  }
}

function openInfoWindow(item, marker, infowindow) {
  if (activeInfoWindow) {
    activeInfoWindow.close()
  }

  const position = new kakaoMapsApi.maps.LatLng(item.latitude, item.longitude)
  mapInstance.setLevel(6)

  infowindow.open(mapInstance, marker)
  mapInstance.setCenter(position)
  mapInstance.panBy(0, -MARKER_VERTICAL_OFFSET)
  activeInfoWindow = infowindow
}

function getRequestedMapItem() {
  const placeId = String(route.query.place || '')

  if (!placeId) {
    return null
  }

  return getMapItems('', '').find((item) => String(item.id) === placeId) || null
}

function applyRequestedPlaceFilter() {
  const item = getRequestedMapItem()

  if (!item) {
    return
  }

  selectedCategoryCodes.value = [item.categoryCode]
  isAllCategoriesSelected.value = false
  selectedDistrictCodes.value = item.districtCode ? [item.districtCode] : []
}

function focusRequestedPlace() {
  const item = getRequestedMapItem()
  const markerState = item ? markerStates[item.id] : null

  if (item && markerState) {
    openInfoWindow(item, markerState.marker, markerState.infowindow)
    return true
  }

  return false
}

function centerMapInViewport() {
  window.requestAnimationFrame(() => {
    mapSection.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

function toggleDistrict(code) {
  if (!code) {
    selectedDistrictCodes.value = []
    return
  }

  if (selectedDistrictCodes.value.includes(code)) {
    selectedDistrictCodes.value = selectedDistrictCodes.value.filter((item) => item !== code)
  } else {
    selectedDistrictCodes.value = [...selectedDistrictCodes.value, code]
  }
}

function toggleCategory(code) {
  if (!code) {
    selectedCategoryCodes.value = []
    isAllCategoriesSelected.value = !isAllCategoriesSelected.value
    return
  }

  isAllCategoriesSelected.value = false

  if (selectedCategoryCodes.value.includes(code)) {
    selectedCategoryCodes.value = selectedCategoryCodes.value.filter((item) => item !== code)
  } else {
    selectedCategoryCodes.value = [...selectedCategoryCodes.value, code]
  }
}

function getTargetCenter() {
  if (!kakaoMapsApi) {
    return null
  }

  if (selectedDistrictCodes.value.length) {
    const firstSelectedCode = selectedDistrictCodes.value[0]
    const districtCenter = districtCenterMap[firstSelectedCode]
    if (districtCenter) {
      return new kakaoMapsApi.maps.LatLng(districtCenter.lat, districtCenter.lng)
    }
  }

  return new kakaoMapsApi.maps.LatLng(37.5665, 126.978)
}

function renderMap() {
  if (!mapContainer.value || !mapInstance || !kakaoMapsApi) {
    return
  }

  clearMarkers()

  const targetCenter = getTargetCenter()

  if (!mapItems.value.length) {
    mapInstance.setCenter(targetCenter)
    mapInstance.setLevel(7)
    return
  }

  mapItems.value.forEach((item) => {
    const position = new kakaoMapsApi.maps.LatLng(item.latitude, item.longitude)

    const marker = new kakaoMapsApi.maps.Marker({
      position,
      map: mapInstance,
      image: createCategoryMarkerImage(kakaoMapsApi, item),
    })

    const infowindow = new kakaoMapsApi.maps.InfoWindow({
      content: `
        <div class="kakao-map-info-window" style="font-size: 13px; line-height: 1.4;">
          ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" />` : ''}
          <strong style="display:block; margin-bottom: 4px;">${item.name}</strong>
          <p style="margin: 0; color: #4b5563;">${item.address}</p>
        </div>
      `,
      removable: true,
      disableAutoPan: true,
    })

    kakaoMapsApi.maps.event.addListener(marker, 'click', () => {
      openInfoWindow(item, marker, infowindow)
    })

    markerStates[item.id] = { marker, infowindow }
    markers.push(marker)
  })

  mapInstance.setCenter(targetCenter)
  mapInstance.setLevel(7)
}

function handleCardClick(item) {
  const markerState = markerStates[item.id]
  if (!markerState || !mapInstance || !kakaoMapsApi) {
    return
  }

  openInfoWindow(item, markerState.marker, markerState.infowindow)
  mapSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function loadKakaoScript() {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve(window.kakao)
      return
    }

    const existing = document.getElementById('kakao-map-sdk')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.kakao))
      existing.addEventListener('error', () => reject(new Error('Kakao 지도 SDK 로드 실패')))
      return
    }

    const script = document.createElement('script')
    script.id = 'kakao-map-sdk'
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${apiKey}`
    script.async = true
    script.addEventListener('load', () => resolve(window.kakao))
    script.addEventListener('error', () => reject(new Error('Kakao 지도 SDK 로드 실패')))
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  if (!apiKey) {
    mapError.value = 'Kakao 지도 API 키가 설정되지 않았습니다.'
    return
  }

  try {
    applyRequestedPlaceFilter()
    kakaoMapsApi = await loadKakaoScript()
    kakaoMapsApi.maps.load(() => {
      if (!mapContainer.value) {
        mapError.value = '지도 컨테이너를 찾을 수 없습니다.'
        return
      }

      const defaultPosition = new kakaoMapsApi.maps.LatLng(37.5665, 126.978)
      mapInstance = new kakaoMapsApi.maps.Map(mapContainer.value, {
        center: defaultPosition,
        level: 5,
      })

      renderMap()
      if (focusRequestedPlace()) {
        centerMapInViewport()
      }
    })
  } catch (error) {
    mapError.value = error?.message || '지도 로드에 실패했습니다.'
  }
})

watch([selectedDistrictCodes, selectedCategoryCodes, isAllCategoriesSelected], () => {
  renderMap()
}, { deep: true })

watch(
  () => route.query.place,
  async () => {
    applyRequestedPlaceFilter()
    await nextTick()
    renderMap()
    if (focusRequestedPlace()) {
      centerMapInViewport()
    }
  }
)
</script>

<template>
  <div class="container page-stack">
    <div>
      <p class="eyebrow">Map View</p>
      <h1>서울 지역 지도</h1>
    </div>

    <div class="map-region-filter" aria-label="지역 선택 필터">
      <strong>지역 선택</strong>
      <div class="map-region-buttons">
        <button
          type="button"
          class="map-region-button"
          :class="{ 'is-active': !selectedDistrictCodes.length }"
          :style="!selectedDistrictCodes.length ? { background: '#16a34a', color: '#fff', borderColor: '#16a34a' } : { background: '#fff', color: '#111827', borderColor: '#d1d5db' }"
          @click="selectedDistrictCodes = []"
        >
          전체 서울
        </button>
        <button
          v-for="district in districtOptions"
          :key="district.code"
          type="button"
          class="map-region-button"
          :class="{ 'is-active': selectedDistrictCodes.includes(district.code) }"
          :style="selectedDistrictCodes.includes(district.code) ? { background: '#16a34a', color: '#fff', borderColor: '#16a34a' } : { background: '#fff', color: '#111827', borderColor: '#d1d5db' }"
          @click="toggleDistrict(district.code)"
        >
          {{ district.name }}
        </button>
      </div>
    </div>

    <div class="map-category-filter" aria-label="장소 종류 필터">
      <strong>장소 종류</strong>
      <div class="map-category-buttons">
        <button
          type="button"
          class="map-category-button"
          :class="{ 'is-active': isAllCategoriesSelected }"
          :aria-pressed="isAllCategoriesSelected"
          @click="toggleCategory('')"
        >
          <span class="map-category-all-icon" aria-hidden="true"></span>
          전체
        </button>
        <button
          v-for="contentType in contentTypeOptions"
          :key="contentType.code"
          type="button"
          class="map-category-button"
          :class="{ 'is-active': selectedCategoryCodes.includes(contentType.code) }"
          :aria-pressed="selectedCategoryCodes.includes(contentType.code)"
          @click="toggleCategory(contentType.code)"
        >
          <span
            class="map-category-color"
            :style="{ backgroundColor: contentType.color }"
            aria-hidden="true"
          ></span>
          {{ contentType.name }}
        </button>
      </div>
    </div>

    <section ref="mapSection" class="map-container" aria-label="지도 영역">
      <div ref="mapContainer" class="map-renderer"></div>
      <div v-if="mapError" class="map-error">
        {{ mapError }}
      </div>
    </section>

    <section class="map-list-toolbar" aria-label="장소 목록 검색">
      <div>
        <strong>장소 목록</strong>
        <p>
          검색 결과 {{ filteredMapItems.length }}개
          <span v-if="searchQuery">/ 필터 전체 {{ mapItems.length }}개</span>
        </p>
      </div>
      <div class="map-list-controls">
        <div class="map-view-toggle" role="group" aria-label="장소 목록 보기 방식">
          <button
            type="button"
            :class="{ 'is-active': listViewMode === 'card' }"
            :aria-pressed="listViewMode === 'card'"
            @click="listViewMode = 'card'"
          >
            ▦ 카드형
          </button>
          <button
            type="button"
            :class="{ 'is-active': listViewMode === 'list' }"
            :aria-pressed="listViewMode === 'list'"
            @click="listViewMode = 'list'"
          >
            ☰ 목록형
          </button>
        </div>
        <div class="map-search-field">
          <label class="sr-only" for="map-place-search">장소 이름, 주소 또는 지역 검색</label>
          <input
            id="map-place-search"
            v-model="searchQuery"
            class="text-input"
            type="search"
            placeholder="장소 이름, 주소, 지역 검색"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="button button-ghost"
            @click="searchQuery = ''"
          >
            초기화
          </button>
        </div>
      </div>
    </section>

    <div
      v-if="filteredMapItems.length"
      class="map-place-results"
      :class="listViewMode === 'card' ? 'info-grid' : 'map-place-list'"
    >
      <article
        v-for="item in filteredMapItems"
        :key="item.id"
        class="info-card category-themed-card"
        :style="{
          '--category-color': item.markerColor,
          '--category-stroke-color': item.markerStrokeColor,
        }"
      >
        <div v-if="listViewMode === 'card'" class="place-card-image">
          <img
            v-if="item.imageUrl && !failedImageIds.has(item.id)"
            :src="item.imageUrl"
            :alt="`${item.name} 대표 이미지`"
            loading="lazy"
            @error="markImageAsFailed(item.id)"
          />
          <span v-else>이미지 없음</span>
        </div>
        <div class="place-card-title">
          <h2>
            {{ item.name }}
            <span class="badge">{{ item.category }}</span>
          </h2>
        </div>
        <p>{{ item.address }}</p>
        <div class="map-card-actions">
          <button
            type="button"
            class="button button-secondary map-marker-button"
            @click="handleCardClick(item)"
          >
            지도에서 보기
          </button>
          <button
            type="button"
            class="button favorite-button"
            :class="{ 'is-active': isFavorite(item) }"
            :aria-pressed="isFavorite(item)"
            @click="toggleFavorite(item)"
          >
            {{ isFavorite(item) ? '찜해제' : '찜하기' }}
          </button>
        </div>
      </article>
    </div>
    <EmptyState
      v-else-if="!isAllCategoriesSelected && !selectedCategoryCodes.length"
      title="장소 종류를 선택해 주세요."
      description="전체 또는 원하는 장소 종류를 선택하면 지도와 목록에 표시됩니다."
    />
    <EmptyState
      v-else-if="searchQuery"
      title="검색 결과가 없습니다."
      description="다른 장소 이름, 주소 또는 지역명을 입력해 보세요."
    />
    <EmptyState v-else title="선택한 필터에 해당하는 장소가 없습니다." />
  </div>
</template>
