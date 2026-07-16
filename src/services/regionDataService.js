import tourismData from '@/data/서울_관광지.json'
import leisureSportsData from '@/data/서울_레포츠.json'
import culturalFacilityData from '@/data/서울_문화시설.json'
import shoppingData from '@/data/서울_쇼핑.json'
import accommodationData from '@/data/서울_숙박.json'
import travelCourseData from '@/data/서울_여행코스.json'
import festivalData from '@/data/서울_축제공연행사.json'
import { localizeRegionItem } from '@/services/localizationService'

const CONTENT_TYPE_DATASETS = Object.freeze([
  { code: '12', name: '관광지', color: '#FACC15', strokeColor: '#92400E', data: tourismData },
  { code: '14', name: '문화시설', color: '#8B5CF6', strokeColor: '#4C1D95', data: culturalFacilityData },
  { code: '15', name: '축제공연행사', color: '#EC4899', strokeColor: '#831843', data: festivalData },
  { code: '25', name: '여행코스', color: '#14B8A6', strokeColor: '#134E4A', data: travelCourseData },
  { code: '28', name: '레포츠', color: '#3B82F6', strokeColor: '#1E3A8A', data: leisureSportsData },
  { code: '32', name: '숙박', color: '#F97316', strokeColor: '#7C2D12', data: accommodationData },
  { code: '38', name: '쇼핑', color: '#22C55E', strokeColor: '#14532D', data: shoppingData },
])

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
  545: '금천구',
  560: '영등포구',
  590: '동작구',
  620: '관악구',
  650: '서초구',
  680: '강남구',
  710: '송파구',
  740: '강동구',
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
  const englishItem = localizeRegionItem(item, 'en')
  return normalizeText(
    [
      item.name,
      item.category,
      item.districtName,
      item.address,
      item.description,
      item.tags?.join(' '),
      englishItem.name,
      englishItem.category,
      englishItem.districtName,
      englishItem.address,
      englishItem.description,
      englishItem.tags?.join(' ')
    ].join(' ')
  )
}

function normalizeDateValue(value) {
  const digits = String(value || '').replace(/\D/g, '')

  if (digits.length !== 8) {
    return ''
  }

  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
}

function normalizeMapItem(item, contentType) {
  const latitude = Number(item.mapy ?? item.latitude ?? item.y ?? item.lat)
  const longitude = Number(item.mapx ?? item.longitude ?? item.x ?? item.lng)
  const districtCode = String(item.lDongSignguCd ?? item.districtCode ?? '').trim()
  const districtName = SEOUL_DISTRICT_CODES[districtCode] || ''

  return {
    ...item,
    id: item.contentid ?? item.id ?? `${item.title ?? 'item'}-${item.addr1 ?? ''}`,
    category: contentType?.name ?? item.contentType ?? item.category ?? '기타',
    categoryCode: contentType?.code ?? String(item.contenttypeid ?? ''),
    markerColor: contentType?.color ?? '#FACC15',
    markerStrokeColor: contentType?.strokeColor ?? '#92400E',
    name: item.title ?? item.name ?? '이름 없음',
    address: item.addr1 ?? item.address ?? '',
    description: item.overview ?? item.description ?? '',
    imageUrl: item.firstimage2 || item.firstimage || item.imageUrl || item.image || '',
    largeImageUrl: item.firstimage || item.firstimage2 || item.imageUrl || item.image || '',
    startDate: normalizeDateValue(item.eventstartdate ?? item.startDate),
    endDate: normalizeDateValue(item.eventenddate ?? item.endDate),
    districtCode,
    districtName,
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
  }
}

const REGION_ITEMS = CONTENT_TYPE_DATASETS.flatMap((contentType) =>
  extractItems(contentType.data).map((item) => normalizeMapItem(item, contentType))
)

export function getRegionItems() {
  return REGION_ITEMS
}

export function searchRegionData(query, limit = 8) {
  const keyword = normalizeText(query)
  const items = getRegionItems()

  if (!keyword) {
    return items.slice(0, limit)
  }

  const tokens = keyword.split(/\s+/).filter(Boolean)
  const scoredItems = items
    .map((item) => {
      const searchText = buildSearchText(item)
      const matchedTokenCount = tokens.filter((token) => searchText.includes(token)).length

      return { item, matchedTokenCount }
    })
    .filter(({ matchedTokenCount }) => matchedTokenCount > 0)

  const exactMatches = scoredItems.filter(
    ({ matchedTokenCount }) => matchedTokenCount === tokens.length
  )

  // 질문에 조사나 자연어 표현이 붙어도 장소명·지역명처럼 일부 단어가 맞으면 전달한다.
  return (exactMatches.length ? exactMatches : scoredItems)
    .sort((left, right) => right.matchedTokenCount - left.matchedTokenCount)
    .slice(0, limit)
    .map(({ item }) => item)
}

export function getFestivalItems() {
  return getRegionItems()
    .filter((item) => item.categoryCode === '15' && item.startDate && item.endDate)
    .sort((left, right) => new Date(left.startDate) - new Date(right.startDate))
}

function matchesDistrict(item, districtName) {
  return (
    !districtName ||
    item.districtName === districtName ||
    item.address.includes(districtName)
  )
}

export function getTourismItems(districtName = '') {
  return getRegionItems().filter(
    (item) => item.categoryCode === '12' && matchesDistrict(item, districtName)
  )
}

export function getFestivalItemsForMonth(date = new Date(), districtName = '') {
  const year = date.getFullYear()
  const month = date.getMonth()
  const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const monthEnd = `${year}-${String(month + 1).padStart(2, '0')}-${String(
    new Date(year, month + 1, 0).getDate()
  ).padStart(2, '0')}`

  return getFestivalItems()
    .filter((festival) => festival.startDate <= monthEnd && festival.endDate >= monthStart)
    .filter((festival) => matchesDistrict(festival, districtName))
}

export function getFestivalItemsForDate(date = new Date()) {
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`

  return getFestivalItems().filter(
    (festival) => festival.startDate <= dateKey && festival.endDate >= dateKey
  )
}

export function getContentTypeOptions() {
  return CONTENT_TYPE_DATASETS.map(({ code, name, color }) => ({ code, name, color }))
}

export function getDistrictOptions() {
  return Object.entries(SEOUL_DISTRICT_CODES).map(([code, name]) => ({
    code,
    name,
  }))
}

export function getMapItems(districtCodes = '', categoryCodes = '') {
  const selectedCodes = String(districtCodes || '')
    .split(',')
    .map((code) => code.trim())
    .filter(Boolean)
  const selectedCategoryCodes = String(categoryCodes || '')
    .split(',')
    .map((code) => code.trim())
    .filter(Boolean)

  return getRegionItems()
    .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
    .filter((item) => {
      if (!selectedCategoryCodes.length) {
        return true
      }

      return selectedCategoryCodes.includes(item.categoryCode)
    })
    .filter((item) => {
      if (!selectedCodes.length) {
        return true
      }

      return selectedCodes.includes(String(item.districtCode))
    })
}
