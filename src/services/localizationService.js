const DISTRICT_TRANSLATIONS = Object.freeze({
  종로구: 'Jongno-gu', 중구: 'Jung-gu', 용산구: 'Yongsan-gu', 성동구: 'Seongdong-gu',
  광진구: 'Gwangjin-gu', 동대문구: 'Dongdaemun-gu', 중랑구: 'Jungnang-gu', 성북구: 'Seongbuk-gu',
  강북구: 'Gangbuk-gu', 도봉구: 'Dobong-gu', 노원구: 'Nowon-gu', 은평구: 'Eunpyeong-gu',
  서대문구: 'Seodaemun-gu', 마포구: 'Mapo-gu', 양천구: 'Yangcheon-gu', 강서구: 'Gangseo-gu',
  구로구: 'Guro-gu', 금천구: 'Geumcheon-gu', 영등포구: 'Yeongdeungpo-gu', 동작구: 'Dongjak-gu',
  관악구: 'Gwanak-gu', 서초구: 'Seocho-gu', 강남구: 'Gangnam-gu', 송파구: 'Songpa-gu', 강동구: 'Gangdong-gu'
})

const CATEGORY_TRANSLATIONS = Object.freeze({
  관광지: 'Attractions', 문화시설: 'Cultural Facilities', 축제공연행사: 'Festivals & Events',
  여행코스: 'Travel Courses', 레포츠: 'Leisure Sports', 숙박: 'Accommodation', 쇼핑: 'Shopping', 기타: 'Other'
})

const LANDMARK_TRANSLATIONS = Object.freeze({
  청계천: 'Cheonggyecheon Stream', 경복궁: 'Gyeongbokgung Palace', 한강: 'Han River',
  '롯데월드타워 서울스카이': 'Lotte World Tower Seoul Sky', 국립중앙박물관: 'National Museum of Korea',
  서울숲: 'Seoul Forest', 남산서울타워: 'N Seoul Tower', 창덕궁: 'Changdeokgung Palace',
  북촌한옥마을: 'Bukchon Hanok Village', 동대문디자인플라자: 'Dongdaemun Design Plaza'
})

const englishItemCache = new WeakMap()

const INITIALS = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h']
const MEDIALS = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i']
const FINALS = ['', 'k', 'k', 'ks', 'n', 'nj', 'nh', 't', 'l', 'lk', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'p', 'ps', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 'h']

function romanizeHangul(text) {
  return String(text || '').replace(/[가-힣]+/g, (word) => {
    const romanized = [...word].map((character) => {
      const code = character.charCodeAt(0) - 0xac00
      const initial = Math.floor(code / 588)
      const medial = Math.floor((code % 588) / 28)
      const final = code % 28
      return `${INITIALS[initial]}${MEDIALS[medial]}${FINALS[final]}`
    }).join('')
    return romanized.charAt(0).toUpperCase() + romanized.slice(1)
  })
}

export function translateCategory(value) {
  return CATEGORY_TRANSLATIONS[value] || romanizeHangul(value)
}

export function translateDistrict(value) {
  return DISTRICT_TRANSLATIONS[value] || romanizeHangul(value)
}

export function translateAddress(value) {
  let address = String(value || '')
    .replace(/서울특별시/g, 'Seoul')
    .replace(/서울시/g, 'Seoul')

  Object.entries(DISTRICT_TRANSLATIONS).forEach(([ko, en]) => {
    address = address.replaceAll(ko, en)
  })

  return romanizeHangul(address)
    .replace(/(\d+)번지/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

export function translateDataText(value) {
  const text = String(value || '').trim()
  if (!text) return ''
  if (LANDMARK_TRANSLATIONS[text]) return LANDMARK_TRANSLATIONS[text]
  if (CATEGORY_TRANSLATIONS[text]) return CATEGORY_TRANSLATIONS[text]
  if (DISTRICT_TRANSLATIONS[text]) return DISTRICT_TRANSLATIONS[text]
  return romanizeHangul(text)
}

export function localizeRegionItem(item, locale) {
  if (!item || locale !== 'en') return item
  if (englishItemCache.has(item)) return englishItemCache.get(item)

  const localizedItem = {
    ...item,
    name: translateDataText(item.name),
    category: translateCategory(item.category),
    districtName: translateDistrict(item.districtName),
    address: translateAddress(item.address),
    description: translateDataText(item.description),
    tags: item.tags?.map(translateDataText)
  }

  englishItemCache.set(item, localizedItem)
  return localizedItem
}

export function localizeRegionItems(items, locale) {
  return items.map((item) => localizeRegionItem(item, locale))
}
