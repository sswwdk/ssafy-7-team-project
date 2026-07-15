import tourismData from '@/data/서울_관광지.json'

const SEOUL_DISTRICT_CODES = Object.freeze({
  110: '종로구',
  140: '중구',
  170: '용산구',
  200: '성동구',
  215: '광진구',
  230: '동대문구',
  260: '중랑구',
  290: '성북구',
  305: '강북구',
  320: '도봉구',
  350: '노원구',
  380: '은평구',
  410: '서대문구',
  440: '마포구',
  470: '양천구',
  500: '강서구',
  530: '구로구',
  560: '금천구',
  590: '영등포구',
  650: '동작구',
  680: '관악구',
  710: '서초구',
  740: '강남구',
  770: '송파구',
  800: '강동구',
})

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

function normalizeMapItem(item) {
  const latitude = Number(item.mapy ?? item.latitude ?? item.y ?? item.lat)
  const longitude = Number(item.mapx ?? item.longitude ?? item.x ?? item.lng)
  const districtCode = String(item.lDongSignguCd ?? item.districtCode ?? '').trim()
  const districtName = SEOUL_DISTRICT_CODES[districtCode] || ''

  return {
    ...item,
    id: item.contentid ?? item.id ?? `${item.title ?? 'item'}-${item.addr1 ?? ''}`,
    category: item.contentType ?? item.category ?? 'tourism',
    name: item.title ?? item.name ?? '이름 없음',
    address: item.addr1 ?? item.address ?? '',
    imageUrl: item.firstimage2 ?? item.firstimage ?? item.imageUrl ?? item.image ?? '',
    districtCode,
    districtName,
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
  }
}

export function getRegionItems() {
  return extractItems(tourismData).map(normalizeMapItem)
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

export function getDistrictOptions() {
  return Object.entries(SEOUL_DISTRICT_CODES).map(([code, name]) => ({
    code,
    name,
  }))
}

export function getMapItems(districtCodes = '') {
  const selectedCodes = String(districtCodes || '')
    .split(',')
    .map((code) => code.trim())
    .filter(Boolean)

  return getRegionItems()
    .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
    .filter((item) => {
      if (!selectedCodes.length) {
        return true
      }

      return selectedCodes.includes(String(item.districtCode))
    })
}
