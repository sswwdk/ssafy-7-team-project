<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getFestivalItems } from '@/services/regionDataService'
import { formatDate } from '@/utils/date'

const festivals = getFestivalItems()
const now = ref(new Date())
const currentMonth = ref(new Date(now.value.getFullYear(), now.value.getMonth(), 1))
const selectedDateKey = ref(formatDateKey(now.value))
const selectedStatus = ref('month')
const weekDays = Object.freeze(['일', '월', '화', '수', '목', '금', '토'])
let clockTimer = null

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getFestivalStatus(festival) {
  const todayKey = formatDateKey(now.value)

  if (festival.endDate < todayKey) {
    return 'ended'
  }

  if (festival.startDate > todayKey) {
    return 'upcoming'
  }

  return 'ongoing'
}

function getStatusLabel(status) {
  return {
    ongoing: '진행 중',
    upcoming: '예정',
    ended: '종료',
  }[status]
}

function isFestivalOnDate(festival, dateKey) {
  return festival.startDate <= dateKey && festival.endDate >= dateKey
}

function selectDate(dateKey) {
  selectedDateKey.value = dateKey

  if (selectedStatus.value === 'month') {
    selectedStatus.value = 'day'
  }
}

function setStatusFilter(status) {
  selectedStatus.value = status

  if (status === 'month') {
    selectedDateKey.value = formatDateKey(currentMonth.value)
    return
  }

  if (status === 'upcoming') {
    const nearestUpcomingFestival = festivals
      .filter((festival) => getFestivalStatus(festival) === 'upcoming')
      .sort((left, right) => left.startDate.localeCompare(right.startDate))[0]

    if (nearestUpcomingFestival) {
      const festivalDate = new Date(`${nearestUpcomingFestival.startDate}T00:00:00`)
      currentMonth.value = new Date(festivalDate.getFullYear(), festivalDate.getMonth(), 1)
      selectedDateKey.value = nearestUpcomingFestival.startDate
    }
    return
  }

  goToToday()
}

function changeMonth(offset) {
  const nextMonth = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + offset,
    1
  )
  currentMonth.value = nextMonth
  selectedDateKey.value = formatDateKey(nextMonth)
}

function goToToday() {
  const today = new Date()
  now.value = today
  currentMonth.value = new Date(today.getFullYear(), today.getMonth(), 1)
  selectedDateKey.value = formatDateKey(today)
}

const currentTimeLabel = computed(() =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now.value)
)

const monthTitle = computed(() =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
  }).format(currentMonth.value)
)

const selectedDateLabel = computed(() =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date(`${selectedDateKey.value}T00:00:00`))
)

const scheduleTitle = computed(() =>
  selectedStatus.value === 'month' ? `${monthTitle.value} 전체 축제` : selectedDateLabel.value
)

const visibleFestivals = computed(() => {
  if (selectedStatus.value === 'month') {
    const year = currentMonth.value.getFullYear()
    const month = currentMonth.value.getMonth()
    const monthStart = formatDateKey(new Date(year, month, 1))
    const monthEnd = formatDateKey(new Date(year, month + 1, 0))

    return festivals.filter(
      (festival) => festival.startDate <= monthEnd && festival.endDate >= monthStart
    )
  }

  if (selectedStatus.value === 'day') {
    return festivals
  }

  return festivals.filter((festival) => getFestivalStatus(festival) === selectedStatus.value)
})

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const gridStart = new Date(year, month, 1 - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    const key = formatDateKey(date)
    const dayFestivals = visibleFestivals.value.filter((festival) =>
      isFestivalOnDate(festival, key)
    )

    return {
      key,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: key === formatDateKey(now.value),
      festivals: dayFestivals,
    }
  })
})

const selectedFestivals = computed(() =>
  visibleFestivals.value
    .filter((festival) =>
      selectedStatus.value === 'month'
        ? true
        : isFestivalOnDate(festival, selectedDateKey.value)
    )
    .sort((left, right) => left.startDate.localeCompare(right.startDate))
)

const monthlyFestivalCount = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const monthStart = formatDateKey(new Date(year, month, 1))
  const monthEnd = formatDateKey(new Date(year, month + 1, 0))

  return festivals.filter(
    (festival) => festival.startDate <= monthEnd && festival.endDate >= monthStart
  ).length
})

const festivalStatusSummary = computed(() =>
  festivals.reduce(
    (summary, festival) => {
      summary[getFestivalStatus(festival)] += 1
      return summary
    },
    { ongoing: 0, upcoming: 0, ended: 0 }
  )
)

onMounted(() => {
  clockTimer = window.setInterval(() => {
    now.value = new Date()
  }, 30_000)
})

onUnmounted(() => {
  window.clearInterval(clockTimer)
})
</script>

<template>
  <div class="container page-stack">
    <div class="festival-page-heading">
      <div>
        <p class="eyebrow">Festival Calendar</p>
        <h1>서울 축제 일정</h1>
        <p class="help-text">현재 날짜를 기준으로 진행 중인 축제와 예정 일정을 확인하세요.</p>
      </div>
      <div class="festival-live-time" aria-live="polite">
        <span aria-hidden="true"></span>
        <div>
          <small>현재 시각</small>
          <strong>{{ currentTimeLabel }}</strong>
        </div>
      </div>
    </div>

    <section class="festival-summary-grid" aria-label="축제 일정 현황">
      <button
        type="button"
        class="festival-summary-card status-ongoing"
        :class="{ 'is-active': selectedStatus === 'ongoing' }"
        :aria-pressed="selectedStatus === 'ongoing'"
        @click="setStatusFilter('ongoing')"
      >
        <span>진행 중</span>
        <strong>{{ festivalStatusSummary.ongoing }}</strong>
      </button>
      <button
        type="button"
        class="festival-summary-card status-upcoming"
        :class="{ 'is-active': selectedStatus === 'upcoming' }"
        :aria-pressed="selectedStatus === 'upcoming'"
        @click="setStatusFilter('upcoming')"
      >
        <span>예정</span>
        <strong>{{ festivalStatusSummary.upcoming }}</strong>
      </button>
      <button
        type="button"
        class="festival-summary-card"
        :class="{ 'is-active': selectedStatus === 'month' }"
        :aria-pressed="selectedStatus === 'month'"
        @click="setStatusFilter('month')"
      >
        <span>{{ monthTitle }} 전체</span>
        <strong>{{ monthlyFestivalCount }}</strong>
      </button>
    </section>

    <section class="festival-calendar-card">
      <div class="festival-calendar-header">
        <div class="festival-calendar-navigation">
          <button type="button" class="button button-ghost" aria-label="이전 달" @click="changeMonth(-1)">
            ‹
          </button>
          <h2>{{ monthTitle }}</h2>
          <button type="button" class="button button-ghost" aria-label="다음 달" @click="changeMonth(1)">
            ›
          </button>
        </div>
        <button type="button" class="button button-secondary" @click="goToToday">오늘</button>
      </div>

      <div class="festival-calendar-scroll">
        <div class="festival-calendar-grid">
          <div
            v-for="(weekDay, index) in weekDays"
            :key="weekDay"
            class="festival-weekday"
            :class="{ sunday: index === 0, saturday: index === 6 }"
          >
            {{ weekDay }}
          </div>

          <button
            v-for="day in calendarDays"
            :key="day.key"
            type="button"
            class="festival-calendar-day"
            :class="{
              'is-outside': !day.isCurrentMonth,
              'is-today': day.isToday,
              'is-selected': selectedDateKey === day.key,
            }"
            :aria-label="`${day.key}, 축제 ${day.festivals.length}개`"
            @click="selectDate(day.key)"
          >
            <span class="festival-day-number">{{ day.day }}</span>
            <span class="festival-day-events">
              <span
                v-for="festival in day.festivals.slice(0, 2)"
                :key="festival.id"
                class="festival-day-event"
                :class="`status-${getFestivalStatus(festival)}`"
              >
                {{ festival.name }}
              </span>
              <span v-if="day.festivals.length > 2" class="festival-day-more">
                +{{ day.festivals.length - 2 }}개
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>

    <section>
      <div class="section-heading festival-schedule-heading">
        <div>
          <p class="eyebrow">Selected Date</p>
          <h2>{{ scheduleTitle }}</h2>
        </div>
        <strong>{{ selectedFestivals.length }}개 일정</strong>
      </div>

      <div v-if="selectedFestivals.length" class="festival-event-list">
        <article v-for="festival in selectedFestivals" :key="festival.id" class="festival-event-card">
          <img v-if="festival.imageUrl" :src="festival.imageUrl" :alt="festival.name" />
          <div class="festival-event-content">
            <div class="festival-event-meta">
              <span class="festival-status-badge" :class="`status-${getFestivalStatus(festival)}`">
                {{ getStatusLabel(getFestivalStatus(festival)) }}
              </span>
              <time :datetime="festival.startDate">
                {{ formatDate(festival.startDate) }} ~ {{ formatDate(festival.endDate) }}
              </time>
            </div>
            <h3>{{ festival.name }}</h3>
            <p class="festival-event-address">{{ festival.address || '주소 정보 없음' }}</p>
            <p v-if="festival.description" class="festival-event-description">
              {{ festival.description }}
            </p>
          </div>
        </article>
      </div>
      <EmptyState v-else title="선택한 날짜에 진행되는 축제가 없습니다." />
    </section>
  </div>
</template>
