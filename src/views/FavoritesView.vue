<script setup>
import { computed } from 'vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useFavorites } from '@/composables/useFavorites'
import { useLocale } from '@/composables/useLocale'
import { ROUTE_NAMES } from '@/constants/routes'
import { localizeRegionItems } from '@/services/localizationService'

const { favorites, removeFavorite } = useFavorites()
const { locale, t } = useLocale()
const sortedFavorites = computed(() => localizeRegionItems(
  [...favorites.value].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
  locale.value
))
</script>

<template>
  <div class="container page-stack">
    <div class="section-heading favorite-heading">
      <div>
        <p class="eyebrow">Favorites</p>
        <h1>{{ t('찜 목록') }}</h1>
        <p class="help-text">{{ t('저장한 장소와 축제를 한곳에서 확인하세요.') }}</p>
      </div>
      <strong class="favorite-count">{{ sortedFavorites.length }}{{ locale === 'ko' ? '개' : '' }}</strong>
    </div>

    <div v-if="sortedFavorites.length" class="info-grid favorite-grid">
      <article v-for="favorite in sortedFavorites" :key="favorite.key" class="info-card favorite-card">
        <div class="favorite-card-image">
          <img v-if="favorite.imageUrl" :src="favorite.imageUrl" :alt="`${favorite.name} ${t('대표 이미지')}`" />
          <span v-else>{{ t('이미지 없음') }}</span>
        </div>
        <div class="place-card-title">
          <h2>
            {{ favorite.name }}
            <span class="badge">{{ favorite.category }}</span>
          </h2>
        </div>
        <p>{{ favorite.address || t('주소 정보 없음') }}</p>
        <p v-if="favorite.type === 'festival' && favorite.startDate" class="favorite-date">
          {{ favorite.startDate }} ~ {{ favorite.endDate }}
        </p>
        <div class="favorite-card-actions">
          <RouterLink
            class="button button-secondary"
            :to="favorite.type === 'festival'
              ? { name: ROUTE_NAMES.FESTIVALS }
              : { name: ROUTE_NAMES.MAP, query: { place: favorite.id } }"
          >
            {{ t(favorite.type === 'festival' ? '축제에서 보기' : '지도에서 보기') }}
          </RouterLink>
          <button type="button" class="button favorite-button is-active" @click="removeFavorite(favorite.key)">
            {{ t('찜 해제') }}
          </button>
        </div>
      </article>
    </div>
    <EmptyState
      v-else
      :title="t('찜한 항목이 없습니다.')"
      :description="t('지도와 축제 목록에서 마음에 드는 항목을 찜해보세요.')"
    />
  </div>
</template>
