# SSAFY 대전 1반 7조 팀프로젝트 

바이브 코딩 활용 팀프로젝트입니다. 서울의 관광지, 문화시설, 축제·공연·행사 등 지역 정보를 활용하여 Vue 기반 웹 애플리케이션입니다. 배포에는 Netlify를 활용했습니다.

## 배포 사이트

[LocalHub 바로가기](https://ssafy-7-team-project.netlify.app/)

## 프로젝트 문서

- [팀 프로젝트 규칙](<docs/팀 프로젝트 규칙.docx>): 팀 개발과 협업을 위한 공통 규칙 문서
- [7조 실습 기획서](<docs/7조 실습 기획서.xlsx>): 프로젝트 기능 범위와 실습 계획을 정리한 기획서

## 주요 기능

- **서울 지역 탐색**: 관광지, 문화시설, 축제·공연·행사, 여행코스, 레포츠, 숙박, 쇼핑 정보를 카테고리·자치구별로 탐색합니다.
- **지도와 장소 검색**: Kakao Maps에서 장소 마커를 확인하고, 장소명·주소·지역·카테고리로 검색합니다.
- **축제 일정**: 월별 캘린더에서 진행 중·예정 축제를 확인하고 관심 축제를 저장합니다.
- **대시보드**: 서울 날씨, 축제 현황, 저장한 장소, 커뮤니티 활동을 한 화면에서 확인합니다.
- **커뮤니티**: 게시글 작성·수정·삭제와 댓글 작성 기능을 제공합니다. 게시글과 댓글은 브라우저에 저장됩니다.
- **개인화**: 장소·축제 찜, 다크 모드, 한국어/영어 전환을 지원합니다.
- **챗봇**: 지역 데이터와 현재 브라우저의 커뮤니티 게시글을 바탕으로 서울 정보를 안내합니다.

## 기술 스택

- Vue 3, Vite, Vue Router
- Netlify Functions
- Kakao Maps JavaScript API
- OpenAI Responses API
- Open-Meteo API

## 실행 방법

### 1. 의존성 설치 및 개발 서버 실행

```bash
npm install
npm run dev
```

브라우저에서 Vite가 출력한 로컬 주소를 엽니다.

### 2. 환경변수 설정

지도 기능은 Kakao Maps 앱 키가 필요합니다. 프로젝트 루트에 `.env` 파일을 만들고 아래 값을 설정하세요.

```env
VITE_KAKAO_MAP_API_KEY=your_kakao_javascript_key
```

챗봇은 Netlify Function을 통해 OpenAI를 호출합니다. 배포 환경의 Netlify 사이트 설정에 다음 환경변수를 등록하세요.

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5-mini
```

`OPENAI_MODEL`은 선택 사항이며, 설정하지 않으면 `gpt-5-mini`를 사용합니다. `OPENAI_API_KEY`는 `VITE_` 접두사를 붙이지 마세요. 브라우저 번들에 포함되지 않고 `netlify/functions/chat.mjs`에서만 사용됩니다.

로컬에서 챗봇 Function까지 함께 확인하려면 Netlify CLI 환경에서 프로젝트를 실행해야 합니다. `npm run dev`만 실행한 경우 챗봇 요청 경로(`/.netlify/functions/chat`)는 제공되지 않습니다.

## 빌드 및 검사

```bash
npm run build
npm run preview
npm run lint
npm run format:check
```

## 화면 안내

| 경로 | 화면 | 설명 |
| --- | --- | --- |
| `/` | 메인 | 추천 장소, 카테고리, 축제 및 통합 검색 |
| `/dashboard` | 대시보드 | 날씨, 축제 현황, 찜, 커뮤니티 요약 |
| `/map` | 지도 | Kakao 지도, 자치구·카테고리 필터, 장소 목록 |
| `/festivals` | 축제 일정 | 월별 축제 캘린더와 일정 목록 |
| `/favorites` | 찜 목록 | 저장한 장소와 축제 |
| `/posts` | 커뮤니티 | 게시글과 댓글 목록 |

## 데이터

앱은 `src/data/`의 한국관광공사 TourAPI 4.0 기반 서울 데이터를 사용합니다.

| 카테고리 | 건수 |
| --- | ---: |
| 관광지 | 783 |
| 문화시설 | 566 |
| 축제공연행사 | 201 |
| 여행코스 | 51 |
| 레포츠 | 126 |
| 숙박 | 423 |
| 쇼핑 | 4,368 |
| **합계** | **6,518** |

원본 필드 구조는 [src/data/SCHEMA.md](src/data/SCHEMA.md), 데이터 출처 안내는 [src/data/SOURCE.md](src/data/SOURCE.md)에서 확인할 수 있습니다. `seoul.sample.json`은 구조 확인용 샘플이며, 서비스 화면에서는 사용하지 않습니다.

## 데이터 저장 및 제한 사항

- 게시글, 댓글, 찜 목록, 테마, 언어 설정은 `localStorage`에 저장됩니다. 따라서 다른 브라우저·기기와 동기화되지 않으며 브라우저 데이터를 지우면 함께 삭제됩니다.
- 날씨 정보는 Open-Meteo API 연결이 필요합니다.
- 지도는 Kakao Maps JavaScript 키가 없으면 렌더링되지 않지만, 장소 목록과 필터는 확인할 수 있습니다.
- 챗봇은 Netlify Function과 OpenAI API 키 설정이 필요합니다. 제공된 지역 데이터와 현재 브라우저의 커뮤니티 데이터 범위에서만 답변하도록 구성되어 있습니다.

## 배포

Netlify 배포 설정은 [netlify.toml](netlify.toml)에 포함되어 있습니다.

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- SPA 새로고침은 Netlify redirect 규칙으로 처리합니다.

배포 전 Netlify 환경변수에 `OPENAI_API_KEY`, 필요 시 `OPENAI_MODEL`, 그리고 빌드 환경변수에 `VITE_KAKAO_MAP_API_KEY`를 설정하세요.
