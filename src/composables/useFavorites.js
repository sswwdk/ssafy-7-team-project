import { computed, ref } from 'vue'
import { FAVORITES_STORAGE_KEY } from '@/constants/storage'
import { getRegionItems } from '@/services/regionDataService'

const DEFAULT_FAVORITE_KEYS = Object.freeze([
  '12:1059877',
  '12:736737',
  '14:4077758',
  '14:3338761',
  '38:688998',
  '38:690568',
])

function readFavorites() {
  try {
    const savedFavoritesJson = localStorage.getItem(FAVORITES_STORAGE_KEY)

    if (savedFavoritesJson === null) {
      return createDefaultFavorites()
    }

    const savedFavorites = JSON.parse(savedFavoritesJson)
    return Array.isArray(savedFavorites) ? savedFavorites : []
  } catch {
    return []
  }
}

const favorites = ref(readFavorites())

function createFavorite(item) {
  const categoryCode = String(item.categoryCode || '')

  return {
    key: `${categoryCode}:${item.id}`,
    id: String(item.id),
    type: categoryCode === '15' ? 'festival' : 'place',
    category: item.category || '기타',
    categoryCode,
    name: item.name || '이름 없음',
    address: item.address || '',
    description: item.description || '',
    imageUrl: item.imageUrl || '',
    startDate: item.startDate || '',
    endDate: item.endDate || '',
    latitude: item.latitude ?? null,
    longitude: item.longitude ?? null,
    createdAt: new Date().toISOString(),
  }
}

function createDefaultFavorites() {
  const itemsByKey = new Map(
    getRegionItems().map((item) => [`${String(item.categoryCode || '')}:${item.id}`, item])
  )

  return DEFAULT_FAVORITE_KEYS
    .map((key, index) => {
      const item = itemsByKey.get(key)

      if (!item) return null

      return {
        ...createFavorite(item),
        createdAt: new Date(Date.now() - index).toISOString(),
      }
    })
    .filter(Boolean)
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites.value))
}

export function useFavorites() {
  const favoriteKeys = computed(() => new Set(favorites.value.map((favorite) => favorite.key)))

  function isFavorite(item) {
    return favoriteKeys.value.has(`${String(item.categoryCode || '')}:${item.id}`)
  }

  function toggleFavorite(item) {
    const favorite = createFavorite(item)
    const favoriteIndex = favorites.value.findIndex((savedFavorite) => savedFavorite.key === favorite.key)

    if (favoriteIndex >= 0) {
      favorites.value.splice(favoriteIndex, 1)
    } else {
      favorites.value.unshift(favorite)
    }

    saveFavorites()
  }

  function removeFavorite(key) {
    favorites.value = favorites.value.filter((favorite) => favorite.key !== key)
    saveFavorites()
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
  }
}
