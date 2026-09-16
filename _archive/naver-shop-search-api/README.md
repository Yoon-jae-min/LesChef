# Archive: 네이버 쇼핑 검색 API 연동

홈 「식품 검색」을 네이버 쇼핑 결과 페이지로 보내는 방식으로 바꾸면서 보관한 코드입니다.

## 왜 아카이브했나
- 네이버 개발자센터에서 검색 API 신규 신청이 막힘 (2026-07-31~)
- 쇼핑 검색 API는 종료되어 대체 API 없음

## 포함 내용
- 백엔드: `naverShop.ts`, `foodSearch` 컨트롤러/라우터 (`GET /food-search`)
- 프론트: API 호출형 `FoodSearch` / `foodSearch.ts`

## 현재 활성 방식
검색어 → `https://search.shopping.naver.com/search/all?query=...` 새 탭 열기
