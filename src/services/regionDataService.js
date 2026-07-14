import regionData from '@/data/seoul.sample.json'

function extractItems(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data.items)) {
    return data.items
  }

  if (Array.isArray(data.records)) {
    return data.records
  }

  if (Array.isArray(data.data)) {
    return data.data
  }

  return []
}

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function buildSearchText(item) {
  return normalizeText(
    [item.name, item.category, item.address, item.description, item.tags?.join(' ')].join(' ')
  )
}

export function getRegionItems() {
  return extractItems(regionData)
}

export function searchRegionData(query, limit = 8) {
  const keyword = normalizeText(query)
  const items = getRegionItems()

  if (!keyword) {
    return items.slice(0, limit)
  }

  const tokens = keyword.split(/\s+/).filter(Boolean)

  return items
    .filter((item) => {
      const searchText = buildSearchText(item)
      return tokens.every((token) => searchText.includes(token))
    })
    .slice(0, limit)
}

export function getFestivalItems() {
  return getRegionItems()
    .filter((item) => item.category === 'festival')
    .sort((left, right) => new Date(left.startDate) - new Date(right.startDate))
}

export function getMapItems() {
  return getRegionItems().filter(
    (item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude)
  )
}
