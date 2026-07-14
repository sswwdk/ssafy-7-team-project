<script setup>
import { ref, onMounted } from 'vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getMapItems } from '@/services/regionDataService'

const mapContainer = ref(null)
const mapItems = getMapItems()
const mapError = ref('')
const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY?.trim()

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
    const kakao = await loadKakaoScript()
    kakao.maps.load(() => {
      if (!mapContainer.value) {
        mapError.value = '지도 컨테이너를 찾을 수 없습니다.'
        return
      }

      const defaultPosition = new kakao.maps.LatLng(37.5665, 126.978)
      const map = new kakao.maps.Map(mapContainer.value, {
        center: defaultPosition,
        level: 5,
      })

      if (!mapItems.length) {
        return
      }

      const bounds = new kakao.maps.LatLngBounds()

      mapItems.forEach((item) => {
        const position = new kakao.maps.LatLng(item.latitude, item.longitude)
        bounds.extend(position)

        const marker = new kakao.maps.Marker({
          position,
          map,
        })

        const infowindow = new kakao.maps.InfoWindow({
          content: `
            <div class="kakao-map-info-window">
              <strong>${item.name}</strong>
              <p>${item.address}</p>
            </div>
          `,
        })

        kakao.maps.event.addListener(marker, 'click', () => {
          infowindow.open(map, marker)
        })
      })

      if (mapItems.length > 1) {
        map.setBounds(bounds)
      } else {
        map.setCenter(bounds.getCenter())
      }
    })
  } catch (error) {
    mapError.value = error?.message || '지도 로드에 실패했습니다.'
  }
})
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

    <section class="map-container" aria-label="지도 영역">
      <div ref="mapContainer" class="map-renderer"></div>
      <div v-if="mapError" class="map-error">
        {{ mapError }}
      </div>
    </section>

    <div v-if="mapItems.length" class="info-grid">
      <article v-for="item in mapItems" :key="item.id" class="info-card">
        <span class="badge">{{ item.category }}</span>
        <h2>{{ item.name }}</h2>
        <p>{{ item.address }}</p>
        <small>{{ item.latitude }}, {{ item.longitude }}</small>
      </article>
    </div>
    <EmptyState v-else title="좌표가 있는 지역정보가 없습니다." />
  </div>
</template>
