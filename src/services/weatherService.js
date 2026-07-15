const SEOUL_WEATHER_API_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,precipitation,is_day&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FSeoul&forecast_days=1'

const WEATHER_CODE_GROUPS = [
  { codes: [0], label: '맑음', dayIcon: '☀️', nightIcon: '🌙' },
  { codes: [1, 2], label: '대체로 맑음', dayIcon: '🌤️', nightIcon: '☁️' },
  { codes: [3], label: '흐림', dayIcon: '☁️', nightIcon: '☁️' },
  { codes: [45, 48], label: '안개', dayIcon: '🌫️', nightIcon: '🌫️' },
  { codes: [51, 53, 55, 56, 57], label: '이슬비', dayIcon: '🌦️', nightIcon: '🌧️' },
  { codes: [61, 63, 65, 66, 67], label: '비', dayIcon: '🌧️', nightIcon: '🌧️' },
  { codes: [71, 73, 75, 77], label: '눈', dayIcon: '🌨️', nightIcon: '🌨️' },
  { codes: [80, 81, 82], label: '소나기', dayIcon: '🌦️', nightIcon: '🌧️' },
  { codes: [85, 86], label: '눈 소나기', dayIcon: '🌨️', nightIcon: '🌨️' },
  { codes: [95, 96, 99], label: '뇌우', dayIcon: '⛈️', nightIcon: '⛈️' },
]

function getWeatherPresentation(code, isDay) {
  const group = WEATHER_CODE_GROUPS.find((item) => item.codes.includes(Number(code)))
    ?? { label: '날씨 정보', dayIcon: '🌡️', nightIcon: '🌡️' }

  return {
    label: group.label,
    icon: isDay ? group.dayIcon : group.nightIcon,
  }
}

export async function getSeoulWeather({ signal } = {}) {
  const response = await fetch(SEOUL_WEATHER_API_URL, { signal })

  if (!response.ok) {
    throw new Error('서울 날씨 정보를 불러오지 못했습니다.')
  }

  const data = await response.json()

  if (!data.current || !data.daily) {
    throw new Error('서울 날씨 응답 형식이 올바르지 않습니다.')
  }

  return {
    ...getWeatherPresentation(data.current.weather_code, Boolean(data.current.is_day)),
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    precipitation: data.current.precipitation,
    maximumTemperature: data.daily.temperature_2m_max?.[0],
    minimumTemperature: data.daily.temperature_2m_min?.[0],
    precipitationProbability: data.daily.precipitation_probability_max?.[0],
    observedAt: data.current.time,
  }
}
