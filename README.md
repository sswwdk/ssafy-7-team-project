# LocalHub Team 7 Starter

Vue 3 + Vite 기반 정적 SPA 프로젝트의 기본 골격입니다. 공통 규칙의 구조와 실습 기획표의 기능 범위를 함께 반영했습니다.

## 1. 기획표 충돌사항 보정

실습 기획표에는 `POST /api/chat`, Render 백엔드 배포가 기재되어 있지만 공통 규칙은 **별도 백엔드 서버를 만들지 않고 프런트엔드에서 OpenAI API를 직접 호출**하도록 정하고 있습니다. 따라서 이 골격은 다음과 같이 확정했습니다.

- 프런트엔드: Vue 3, Vite, Vue Router
- 게시판 저장소: 브라우저 localStorage
- 지역정보: 선정 권역 JSON 정적 import
- 챗봇: `src/services/openaiService.js`에서 OpenAI Responses API 직접 호출
- 배포: Netlify만 사용
- 선정 권역: 실습 기획표의 서울을 임시 기준으로 사용
- 선택 기능: 지도 화면을 우선 골격으로 두고, 축제 일정은 데이터 검증용 목록 화면 제공

## 2. 실행

```bash
npm install
cp .env.example .env
npm run dev
```

`.env`에 프로젝트 전용 제한 키와 사용 가능한 모델명을 입력하세요.

```env
VITE_OPENAI_API_KEY=...
VITE_OPENAI_MODEL=gpt-5.6
```

> 교육용 RFP에 따른 구조입니다. `VITE_` 환경변수는 빌드 결과에서 브라우저에 노출될 수 있으므로 실제 서비스 보안 구조로 사용하면 안 됩니다.

## 3. 폴더 구조

```text
src/
├─ assets/styles/            공통 CSS
├─ components/
│  ├─ common/                헤더, 빈 상태, 모달
│  ├─ community/             게시글 카드와 폼
│  └─ chatbot/               챗봇 버튼, 패널, 메시지
├─ composables/              게시글·챗봇 상태와 흐름
├─ constants/                저장 키, 라우트, 모델 설정
├─ data/                     선정 권역 JSON
├─ router/                   화면 라우팅
├─ services/                 localStorage, JSON, OpenAI 호출
├─ utils/                    날짜 변환, 입력 검증
└─ views/                    라우터 연결 화면
```

## 4. 실제 JSON 교체

현재 `src/data/seoul.sample.json`은 구조 확인용 샘플입니다.

1. 고객사가 제공한 서울 JSON을 `src/data/`에 넣습니다.
2. `src/services/regionDataService.js`의 import 경로를 바꿉니다.
3. 실제 JSON이 `items`, `records`, `data` 중 어느 배열을 쓰는지 확인합니다.
4. 필드명이 다르면 `buildSearchText`, `getFestivalItems`, `getMapItems`의 매핑만 수정합니다.
5. 출처, 라이선스, 공공누리 유형, 수집일을 `docs/DATA_LICENSES.md`에 기록합니다.

## 5. 권장 브랜치 순서

```text
chore/project-setup
feat/region-data
feat/post-list
feat/post-create
feat/post-detail
feat/post-edit-delete
feat/chatbot-ui
feat/chatbot-api
feat/map-view
test/responsive-check
chore/netlify-config
docs/feature-spec
```

각 브랜치는 최신 `master`에서 시작하고, 병합 전 빌드·주요 기능·console 오류·API 키 포함 여부를 확인합니다.

## 6. 기능 완료 순서

1. 기본 설정과 공통 레이아웃
2. 선정 권역 JSON 연결
3. 게시판 목록·상세·작성·수정·삭제
4. 수정·삭제 비밀번호 검증
5. 챗봇 UI와 대화 이력
6. JSON 및 localStorage 검색 후 OpenAI 연동
7. 모바일 전체 화면 챗봇
8. 선택 기능 지도 화면
9. Netlify 배포와 SPA 새로고침 확인
10. 기능명세서, 데이터 출처, WBS, 발표자료 정리

## 7. 주의사항

- `localStorage` 접근은 `postStorageService.js`에서만 합니다.
- OpenAI 호출은 `openaiService.js`에서만 합니다.
- 전체 JSON을 API에 보내지 않고 `regionDataService.js`에서 먼저 검색합니다.
- 비밀번호, API 키, 전체 API 응답을 console에 출력하지 않습니다.
- 샘플 축제 데이터는 실제 데이터가 아니므로 발표·제출 전 반드시 교체합니다.
