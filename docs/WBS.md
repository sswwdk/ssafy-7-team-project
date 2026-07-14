# WBS 초안

|  No | 대분류 | 작업명                          | 권장 브랜치              | 완료 조건                        |
| --: | ------ | ------------------------------- | ------------------------ | -------------------------------- |
|   1 | 기획   | 요구사항·충돌사항 확정          | docs/requirements-update | 백엔드 제외, 권역·선택 기능 확정 |
|   2 | 설정   | Vue/Vite·Router·ESLint·Prettier | chore/project-setup      | dev/build/lint 실행              |
|   3 | 공통   | 레이아웃·헤더·반응형 기준       | feat/common-layout       | 360/768/1280 확인                |
|   4 | 데이터 | 실제 권역 JSON 분석·매핑        | feat/region-data         | 목록·검색·누락값 처리            |
|   5 | 게시판 | 목록·검색·필터                  | feat/post-list           | 빈 상태 포함                     |
|   6 | 게시판 | 작성 및 localStorage 저장       | feat/post-create         | trim·필수값 검증                 |
|   7 | 게시판 | 상세 조회                       | feat/post-detail         | 수정·삭제 진입 가능              |
|   8 | 게시판 | 수정·삭제·비밀번호 검증         | feat/post-edit-delete    | 불일치 오류·삭제 확인            |
|   9 | 챗봇   | 플로팅 UI·대화 이력             | feat/chatbot-ui          | 모바일 전체 화면                 |
|  10 | 챗봇   | JSON·게시글 검색과 API 호출     | feat/chatbot-api         | 로딩·실패·타임아웃               |
|  11 | 선택   | 지도 시각화                     | feat/map-view            | 마커·필터·라이선스 표기          |
|  12 | 테스트 | 통합·회귀·반응형 테스트         | test/integration-check   | console 오류 없음                |
|  13 | 배포   | Netlify·SPA Redirect            | chore/netlify-config     | 외부 URL·새로고침 확인           |
|  14 | 문서   | 명세·출처·README·발표자료       | docs/final-deliverables  | 제출물 누락 없음                 |

## 일일 공유 형식

1. 어제 완료한 작업
2. 오늘 진행할 작업
3. 현재 막힌 부분
4. 충돌 가능성이 있는 파일 또는 공통 코드
