# Archive: KAMIS 식재료 시세 기능

홈의 「식재료 가격/시세」 기능을 네이버 식품 쇼핑 검색으로 교체하면서 보관한 코드입니다.

## 포함 내용
- 백엔드: `ingredient-price` 라우터/컨트롤러, `kamis.ts`, `kamisCurated.ts`, KAMIS 상수
- 프론트: `IngredientPrice.tsx`, `ingredientPrice.ts` API 유틸

## 복구 방법
1. 이 폴더의 파일을 원래 `src` 경로로 복사
2. `les-chef-back/src/index.ts`에 `/ingredient-price` 라우트 다시 연결
3. `HomeClient.tsx`에서 `IngredientPrice` 다시 import
4. `constants/index.ts`에 KAMIS export 복구
5. `.env`에 `KAMIS_*` 설정

활성 서비스에서는 사용하지 않습니다.
