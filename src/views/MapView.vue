<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getDistrictOptions, getMapItems } from '@/services/regionDataService'

const mapContainer = ref(null)
const mapError = ref('')
const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY?.trim()
const selectedDistrictCodes = ref([])
const districtOptions = getDistrictOptions()
const filteredMapItems = computed(() => getMapItems(selectedDistrictCodes.value.join(',')))
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
  560: { lat: 37.4567, lng: 126.8950 },
  590: { lat: 37.5261, lng: 126.8960 },
  650: { lat: 37.5124, lng: 126.9390 },
  680: { lat: 37.4654, lng: 126.9430 },
  710: { lat: 37.4836, lng: 127.0328 },
  740: { lat: 37.4959, lng: 127.0667 },
  770: { lat: 37.5146, lng: 127.1050 },
  800: { lat: 37.5300, lng: 127.1230 },
})
let mapInstance = null
let kakaoMapsApi = null
let markers = []
let activeInfoWindow = null
let markerStates = {}

function createYellowMarkerImage(kakao) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <path fill="#FACC15" stroke="#92400E" stroke-width="1.5" d="M14 1.5c-5.2 0-9.5 4.3-9.5 9.5 0 7.1 9.5 15 9.5 15s9.5-7.9 9.5-15C23.5 5.8 19.2 1.5 14 1.5z"/>
      <circle cx="14" cy="11" r="3.8" fill="#FFF7A8"/>
    </svg>
  `
  const encoded = encodeURIComponent(svg)

  return new kakao.maps.MarkerImage(
    `data:image/svg+xml;charset=utf-8,${encoded}`,
    new kakao.maps.Size(24, 28),
    {
      offset: new kakao.maps.Point(12, 28),
    }
  )
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
  mapInstance.panTo(position)
  mapInstance.setLevel(6)

  infowindow.open(mapInstance, marker)
  activeInfoWindow = infowindow
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

  if (!filteredMapItems.value.length) {
    mapInstance.setCenter(targetCenter)
    mapInstance.setLevel(7)
    return
  }

  filteredMapItems.value.forEach((item) => {
    const position = new kakaoMapsApi.maps.LatLng(item.latitude, item.longitude)

    const marker = new kakaoMapsApi.maps.Marker({
      position,
      map: mapInstance,
      image: createYellowMarkerImage(kakaoMapsApi),
    })

    const infowindow = new kakaoMapsApi.maps.InfoWindow({
      content: `
        <div class="kakao-map-info-window" style="max-width: 220px; font-size: 13px; line-height: 1.4;">
          ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" />` : ''}
          <strong style="display:block; margin-bottom: 4px;">${item.name}</strong>
          <p style="margin: 0; color: #4b5563;">${item.address}</p>
        </div>
      `,
      removable: true,
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
    })
  } catch (error) {
    mapError.value = error?.message || '지도 로드에 실패했습니다.'
  }
})

watch(selectedDistrictCodes, () => {
  renderMap()
}, { deep: true })
</script>

<template>
  <div class="container page-stack">
    <div>
      <p class="eyebrow">Map View</p>
      <h1>서울 지역 지도</h1>
      <p class="help-text">
        아래 지도는 .env에 설정된 Kakao Map API 키를 사용해 로드됩니다.
      </p>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; padding: 12px; border: 1px solid #bbf7d0; border-radius: 12px; background: linear-gradient(90deg, #f0fdf4 0%, #ecfdf5 100%); box-shadow: 0 1px 3px rgba(16, 185, 129, 0.1);">
      <button
        type="button"
        :style="!selectedDistrictCodes.length ? { background: '#16a34a', color: '#fff', borderColor: '#16a34a' } : { background: '#fff', color: '#111827', borderColor: '#d1d5db' }"
        @click="selectedDistrictCodes = []"
        style="padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 999px; cursor: pointer; transition: all 0.2s ease;"
      >
        전체 서울
      </button>
      <button
        v-for="district in districtOptions"
        :key="district.code"
        type="button"
        :style="selectedDistrictCodes.includes(district.code) ? { background: '#16a34a', color: '#fff', borderColor: '#16a34a' } : { background: '#fff', color: '#111827', borderColor: '#d1d5db' }"
        @click="toggleDistrict(district.code)"
        style="padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 999px; cursor: pointer; transition: all 0.2s ease;"
      >
        {{ district.name }}
      </button>
    </div>

    <section class="map-container" aria-label="지도 영역">
      <div ref="mapContainer" class="map-renderer"></div>
      <div v-if="mapError" class="map-error">
        {{ mapError }}
      </div>
    </section>

    <div v-if="filteredMapItems.length" class="info-grid">
      <article
        v-for="item in filteredMapItems"
        :key="item.id"
        class="info-card"
        @click="handleCardClick(item)"
        style="cursor: pointer;"
      >
        <span class="badge">{{ item.category }}</span>
        <h2>{{ item.name }}</h2>
        <p>{{ item.address }}</p>
        <small>{{ item.latitude }}, {{ item.longitude }}</small>
      </article>
    </div>
    <EmptyState v-else title="좌표가 있는 지역정보가 없습니다." />
  </div>
</template>
