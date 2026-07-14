<script setup>
import EmptyState from '@/components/common/EmptyState.vue'
import { getMapItems } from '@/services/regionDataService'

const mapItems = getMapItems()
</script>

<template>
  <div class="container page-stack">
    <div>
      <p class="eyebrow">Selected Feature Skeleton</p>
      <h1>서울 지역 지도</h1>
      <p class="help-text">
        현재는 좌표 데이터와 카드 목록을 연결한 기본 골격입니다. 지도 라이브러리는 라이선스와 키
        정책을 확정한 뒤 이 화면에만 추가하세요.
      </p>
    </div>

    <section class="map-placeholder" aria-label="지도 영역">
      <strong>지도 라이브러리 연결 위치</strong>
      <p>regionDataService.getMapItems() 결과를 마커 데이터로 사용합니다.</p>
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
