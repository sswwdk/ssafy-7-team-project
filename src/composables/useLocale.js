import { computed, ref } from 'vue'
import { LANGUAGE_STORAGE_KEY } from '@/constants/storage'

const EN_TRANSLATIONS = Object.freeze({
  메인: 'Home',
  대시보드: 'Dashboard',
  커뮤니티: 'Community',
  지도: 'Map',
  축제: 'Festivals',
  '찜 목록': 'Favorite',
  '주요 메뉴': 'Main navigation',
  '다크 모드': 'Dark mode',
  '라이트 모드': 'Light mode',
  '다크 모드로 전환': 'Switch to dark mode',
  '라이트 모드로 전환': 'Switch to light mode',
  '통합 검색': 'Search',
  '통합 검색 열기': 'Open search',
  '통합 검색 닫기': 'Close search',
  '서울 장소 통합 검색': 'Search Seoul places',
  '서울 장소 검색': 'Search Seoul places',
  '장소 검색어': 'Place search query',
  '장소명, 주소, 지역, 종류 검색': 'Search places, addresses, districts, or categories',
  '찾고 싶은 장소나 지역을 입력해 주세요.': 'Enter a place or district to search.',
  '일치하는 장소가 없습니다.': 'No matching places found.',
  '주소 정보 없음': 'No address available',
  관광지: 'Attractions',
  문화시설: 'Culture',
  축제공연행사: 'Festivals',
  여행코스: 'Courses',
  레포츠: 'Leisure',
  숙박: 'Stays',
  쇼핑: 'Shopping',
  서울: 'Seoul',
  자유: 'Free',
  관광: 'Travel',
  맛집: 'Food',
  '오늘의 서울을': 'Discover Seoul',
  '내 취향대로': 'in your own way',
  발견하세요: 'today',
  '관광지부터 축제, 문화시설, 산책 코스까지 서울의 다채로운 장소를 한 번에 찾아보세요.':
    'Find Seoul attractions, festivals, cultural spaces, walking courses, and more in one place.',
  '어디로 떠나고 싶으세요?': 'Where would you like to go?',
  검색: 'Search',
  추천: 'Popular',
  '지도에서 확인하기 →': 'View on the map →',
  '이전 추천 장소': 'Previous featured place',
  '다음 추천 장소': 'Next featured place',
  '추천 장소 선택': 'Choose a featured place',
  '어떤 서울을 찾고 있나요?': 'What kind of Seoul are you looking for?',
  '서울에서 발견한 추천 장소': 'Recommended places in Seoul',
  '전체 장소 보기 →': 'View all places →',
  '서울에서 만나는 추천 축제': 'Recommended festivals in Seoul',
  '축제 달력 보기 →': 'View festival calendar →',
  '서울 이야기를 함께 나눠보세요': 'Share your Seoul story',
  '나만의 장소 추천과 축제 후기를 공유하고, 다른 여행자의 생생한 댓글을 확인해 보세요.':
    'Share favorite places and festival reviews, and join conversations with other travelers.',
  '커뮤니티 둘러보기': 'Explore the community',
  '공공데이터 기반 지역정보 커뮤니티': 'Public-data-powered local community',
  '관광객과 지역 주민을 위한 서울 지역정보 커뮤니티':
    'A Seoul local information community for travelers and residents',
  '커뮤니티 보기': 'View community',
  '지역정보 보기': 'Explore places',
  '서울의 오늘 날씨': "Today's weather in Seoul",
  '날씨 정보를 불러오는 중입니다.': 'Loading weather information.',
  '다시 시도': 'Try again',
  체감: 'Feels like',
  '최고 / 최저': 'High / Low',
  습도: 'Humidity',
  바람: 'Wind',
  강수확률: 'Rain chance',
  맑음: 'Clear',
  '대체로 맑음': 'Mostly clear',
  흐림: 'Cloudy',
  안개: 'Fog',
  이슬비: 'Drizzle',
  비: 'Rain',
  눈: 'Snow',
  소나기: 'Showers',
  '눈 소나기': 'Snow showers',
  뇌우: 'Thunderstorms',
  '날씨 정보': 'Weather',
  기준: 'Updated',
  '최근 게시글': 'Recent posts',
  '전체 보기': 'View all',
  '아직 게시글이 없습니다.': 'There are no posts yet.',
  '첫 번째 지역정보를 커뮤니티에 공유해 보세요.':
    'Be the first to share local information with the community.',
  '서울 지역 지도': 'Seoul Map',
  '지역 선택 필터': 'District filter',
  '지역 선택': 'District',
  '전체 서울': 'All Seoul',
  '장소 종류 필터': 'Place category filter',
  '장소 종류': 'Place Category',
  전체: 'All',
  '지도 영역': 'Map area',
  '장소 목록 검색': 'Search place list',
  '장소 목록': 'Places',
  '검색 결과': 'Results',
  개: '',
  '필터 전체': 'Filtered total',
  '장소 목록 보기 방식': 'Place list view',
  카드형: 'Cards',
  목록형: 'List',
  '장소 이름, 주소 또는 지역 검색': 'Search by place, address, or district',
  '장소 이름, 주소, 지역 검색': 'Search places, addresses, or districts',
  초기화: 'Reset',
  '대표 이미지': 'image',
  '이미지 없음': 'No image',
  '지도에서 보기': 'View on Map',
  찜하기: 'Add Favorite',
  찜해제: 'Remove Favorite',
  '찜 해제': 'Remove Favorite',
  '장소 종류를 선택해 주세요.': 'Select a place category.',
  '전체 또는 원하는 장소 종류를 선택하면 지도와 목록에 표시됩니다.': 'Choose All or one or more categories to show places on the map and list.',
  '검색 결과가 없습니다.': 'No results found.',
  '다른 장소 이름, 주소 또는 지역명을 입력해 보세요.': 'Try another place, address, or district.',
  '선택한 필터에 해당하는 장소가 없습니다.': 'No places match the selected filters.',
  '서울 축제 일정': 'Seoul Festival Calendar',
  '현재 날짜를 기준으로 진행 중인 축제와 예정 일정을 확인하세요.': 'View ongoing and upcoming festivals based on today.',
  '서울 날씨': 'Seoul Weather',
  '날씨 불러오는 중': 'Loading weather',
  '날씨 다시 불러오기': 'Reload weather',
  '날씨 정보 없음': 'Weather unavailable',
  '현재 시각': 'Current Time',
  '축제 일정 현황': 'Festival schedule summary',
  '진행 중': 'Ongoing',
  예정: 'Upcoming',
  종료: 'Ended',
  '전체 축제': 'All Festivals',
  '이전 달': 'Previous month',
  '다음 달': 'Next month',
  오늘: 'Today',
  일정: 'events',
  '선택한 날짜에 진행되는 축제가 없습니다.': 'There are no festivals on the selected date.',
  '저장한 장소와 축제를 한곳에서 확인하세요.': 'View your saved places and festivals in one place.',
  '축제에서 보기': 'View in Festivals',
  '찜한 항목이 없습니다.': 'No favorites yet.',
  '지도와 축제 목록에서 마음에 드는 항목을 찜해보세요.': 'Save places and festivals you like.',
  '게시글 작성': 'Create Post',
  등록: 'Publish',
  '게시글 수정': 'Edit Post',
  '수정 완료': 'Save Changes',
  '서울 커뮤니티': 'Seoul Community',
  글쓰기: 'Write a Post',
  '게시글 검색 및 필터': 'Search and filter posts',
  '제목 또는 내용 검색': 'Search title or content',
  '전체 카테고리': 'All Categories',
  '조건에 맞는 게시글이 없습니다.': 'No posts match your filters.',
  '검색어를 바꾸거나 새 게시글을 작성해 주세요.': 'Change the search or create a new post.',
  카테고리: 'Category', 제목: 'Title', 내용: 'Content', 저장: 'Save', 취소: 'Cancel',
  비밀번호: 'Password', 확인: 'Confirm', 삭제: 'Delete', 수정: 'Edit', 답글: 'Reply', 댓글: 'Comments',
  전송: 'Send', 닫기: 'Close', 기타: 'Other',
  '요청한 페이지를 찾을 수 없습니다.': 'The requested page could not be found.',
  '홈으로': 'Go Home',
  '표시할 내용이 없습니다.': 'Nothing to display.',
  '지역정보 챗봇': 'Local Information Chatbot',
  '지역정보 챗봇 열기': 'Open local information chatbot',
  'AI 챗봇 도우미': 'AI Chatbot',
  '답변을 생성하고 있습니다.': 'Generating an answer.',
  '질문 입력': 'Enter a question',
  '예: 이번 달 서울 축제를 알려줘': 'Example: Show me Seoul festivals this month',
  작성: 'Created',
  '최종 수정': 'Last updated',
  '게시글 추천': 'Like',
  '댓글 수정': 'Edit Comment',
  '답글 수정': 'Edit Reply',
  '답글 작성': 'Write a Reply',
  '답글 등록': 'Post Reply',
  '댓글 내용': 'Comment',
  '댓글 등록': 'Post Comment',
  '작성 시 비밀번호': 'Password used when posting',
  '수정·삭제용 비밀번호': 'Password for editing and deletion',
  '작성 시 사용한 비밀번호를 입력해 주세요.': 'Enter the password used when posting.',
  '교육용 요구사항에 따라 현재 브라우저 localStorage에 저장됩니다.': 'For this educational project, data is stored in this browser.',
  '답글을 입력해 주세요.': 'Enter a reply.',
  '댓글을 입력해 주세요.': 'Enter a comment.',
  '아직 댓글이 없습니다. 첫 댓글을 남겨보세요.': 'No comments yet. Be the first to comment.',
  '게시글을 찾을 수 없습니다.': 'Post not found.',
  '삭제되었거나 잘못된 주소입니다.': 'It may have been deleted or the address is invalid.',
  목록으로: 'Back to List',
  '게시글 삭제': 'Delete Post',
  '댓글 삭제': 'Delete Comment',
  '대댓글 삭제': 'Delete Reply',
  '카테고리를 선택해 주세요.': 'Select a category.',
  '제목을 입력해 주세요.': 'Enter a title.',
  '제목은 80자 이하로 입력해 주세요.': 'The title must be 80 characters or fewer.',
  '내용을 입력해 주세요.': 'Enter content.',
  '내용은 3,000자 이하로 입력해 주세요.': 'Content must be 3,000 characters or fewer.',
  '댓글 내용을 입력해 주세요.': 'Enter a comment.',
  '댓글은 3,000자 이하로 입력해 주세요.': 'Comments must be 3,000 characters or fewer.',
  '비밀번호를 입력해 주세요.': 'Enter a password.',
  '비밀번호는 4~20자로 입력해 주세요.': 'The password must be 4 to 20 characters.',
  '날씨 정보를 불러오지 못했습니다.': 'Unable to load weather information.',
  'Kakao 지도 SDK 로드 실패': 'Failed to load the Kakao Maps SDK.',
  'Kakao 지도 API 키가 설정되지 않았습니다.': 'The Kakao Maps API key is not configured.',
  '지도 컨테이너를 찾을 수 없습니다.': 'The map container could not be found.',
  '지도 로드에 실패했습니다.': 'Failed to load the map.'
})

function getInitialLocale() {
  if (typeof localStorage === 'undefined') return 'ko'
  return localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'ko'
}

const locale = ref(getInitialLocale())

function applyDocumentLanguage() {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale.value
  }
}

function setLocale(nextLocale) {
  locale.value = nextLocale === 'en' ? 'en' : 'ko'

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, locale.value)
  }

  applyDocumentLanguage()
}

function toggleLocale() {
  setLocale(locale.value === 'ko' ? 'en' : 'ko')
}

function t(text) {
  return locale.value === 'en' ? EN_TRANSLATIONS[text] || text : text
}

applyDocumentLanguage()

export function useLocale() {
  return {
    locale,
    isEnglish: computed(() => locale.value === 'en'),
    setLocale,
    toggleLocale,
    t
  }
}
