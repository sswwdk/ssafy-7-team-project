<script setup>
import EmptyState from '@/components/common/EmptyState.vue'
import { getFestivalItems } from '@/services/regionDataService'
import { formatDate } from '@/utils/date'

const festivals = getFestivalItems()
</script>

<template>
  <div class="container page-stack">
    <div>
      <p class="eyebrow">Optional Feature Skeleton</p>
      <h1>서울 축제 일정</h1>
      <p class="help-text">
        외부 캘린더 패키지 없이 날짜 데이터 검증부터 할 수 있는 목록형 골격입니다.
      </p>
    </div>

    <div v-if="festivals.length" class="timeline-list">
      <article v-for="festival in festivals" :key="festival.id" class="timeline-card">
        <time :datetime="festival.startDate">
          {{ formatDate(festival.startDate) }} ~ {{ formatDate(festival.endDate) }}
        </time>
        <h2>{{ festival.name }}</h2>
        <p>{{ festival.address }}</p>
        <p>{{ festival.description }}</p>
      </article>
    </div>
    <EmptyState v-else title="축제 날짜 데이터가 없습니다." />
  </div>
</template>
