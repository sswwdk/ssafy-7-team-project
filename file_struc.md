현재 프로젝트의 구조와 설정 파일을 확인해 바로 정리해두겠습니다.

Searched for regex `process\.env|import\.meta\.env|OPENAI|apiKey|VITE_|seoul\.sample|sample\.json` (`**/src/**`), 16 results

Read [](file:///c%3A/teamproject/7-team-project/README.md)

Read [](file:///c%3A/teamproject/7-team-project/package.json)

구조와 실제로 연결되는 데이터 지점들을 함께 확인해서, 누락된 부분까지 바로 정리하겠습니다.

Read [](file:///c%3A/teamproject/7-team-project)

Searched for files matching `7-team-project` · `**/.env*`, 1 match

Read [](file:///c%3A/teamproject/7-team-project/src/services/regionDataService.js)

Read [](file:///c%3A/teamproject/7-team-project/src/data/seoul.sample.json)

Read [](file:///c%3A/teamproject/7-team-project/src/services/openaiService.js)

실제 사용에 필요한 입력값과 예시 파일 지점을 더 확인해, 바로 채워야 할 항목까지 함께 정리하겠습니다.

Read [](file:///c%3A/teamproject/7-team-project/.env.example)

Read [](file:///c%3A/teamproject/7-team-project/src/services/postStorageService.js)

현재 이 프로젝트는 Vue 3 + Vite 기반의 SPA이며, 핵심 역할별로 파일이 나뉘어 있습니다.

## 1. 파일 구조 요약

- 진입점
  - index.html: 브라우저 진입 HTML
  - main.js: 앱 진입점
  - App.vue: 최상위 앱 컴포넌트
  - index.js: 페이지 라우팅

- 화면(views)
  - HomeView.vue
  - MapView.vue
  - FestivalCalendarView.vue
  - PostListView.vue
  - PostDetailView.vue
  - PostCreateView.vue
  - PostEditView.vue

- UI 컴포넌트
  - common: 헤더, 모달, 빈 상태
  - community: 게시글 카드/폼
  - chatbot: 챗봇 UI

- 데이터/상태/서비스
  - seoul.sample.json: 지역 데이터 예시
  - regionDataService.js: JSON 검색/필터링
  - openaiService.js: OpenAI API 호출
  - postStorageService.js: 게시글 저장(localStorage)
  - composables: 게시글/챗봇 로직

- 설정/문서
  - .env.example: 환경변수 예시
  - constants: 라우트, 저장 키, 챗봇 설정
  - docs: 기획/데이터 라이선스 문서

---

## 2. 임의나 예시로 만든 파일들

이 프로젝트에는 실제 서비스용 데이터 대신 예시로 넣어둔 파일들이 있습니다.

- seoul.sample.json
  - 서울 지역 데이터를 예시로 넣은 샘플 파일입니다.
  - 실제 서비스에서는 이 파일을 교체해야 합니다.

- HelloWorld.vue
- TheWelcome.vue
- WelcomeItem.vue
- counter.js
  - Vite/ Vue 기본 템플릿에서 나온 예시 파일들입니다.
  - 앱 기능과 직접 연결되지 않는 경우가 많아서 필요하면 정리해도 됩니다.

---

## 3. 꼭 넣어야 하는 데이터

### 1) .env API 키
현재 저장소에는 실제 .env 파일이 없고, .env.example만 있습니다.  
따라서 실제로는 아래처럼 새 파일을 만들어야 합니다.

- 파일명: .env
- 내용 예시:
  - `VITE_OPENAI_API_KEY=여기에_진짜_API_키`
  - `VITE_OPENAI_MODEL=gpt-5.6` 또는 사용 가능한 모델명

이 값이 없으면 openaiService.js에서 에러가 납니다.

### 2) 실제 지역 JSON 데이터
regionDataService.js는 현재 seoul.sample.json을 읽습니다.  
그래서 실제 서비스에서는 이 JSON을 진짜 데이터로 바꿔야 합니다.

각 항목은 최소 아래 필드가 있으면 좋습니다.

- `name`
- `category`
- `address`
- `description`
- `latitude`
- `longitude`
- `tags`
- `startDate`
- `endDate`

특히:
- `category === 'festival'`인 항목은 축제 캘린더에 보여집니다.
- `latitude`, `longitude`가 있어야 지도에 표시됩니다.

### 3) 데이터 출처/라이선스 정보
실제 JSON을 쓰면 DATA_LICENSES.md에 출처와 라이선스 정보를 기록하는 것이 좋습니다.  
README에도 이 부분이 명시되어 있습니다.

---

## 4. 지금 바로 해야 할 최소 작업

1. .env.example 기반으로 실제 .env 생성
2. seoul.sample.json 교체
3. OpenAI API 키 넣기
4. 데이터 출처/라이선스 문서 작성

즉, 핵심은 “API 키 + 실제 지역 JSON 데이터” 두 가지입니다.  
이 두 가지가 들어가야 챗봇과 지도/축제 화면이 실제 동작에 가깝게 됩니다.