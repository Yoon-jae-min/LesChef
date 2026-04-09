import { getIngredientPricesServer } from "@/utils/api/serverApi";
import HomeClient from "@/components/home/HomeClient";
import { Suspense } from "react";

/**
 * 메인 페이지 (서버 컴포넌트)
 * 서버에서 초기 데이터를 가져와서 렌더링
 * 클라이언트 컴포넌트는 로딩 애니메이션과 실시간 업데이트를 위해 사용
 */
export default async function Home() {
  // 서버에서 식재료 물가 정보 가져오기 (사이드바용) — 실패 시 null, 홈은 계속 렌더
  const priceInitialData = await getIngredientPricesServer();
  const priceError =
    priceInitialData === null
      ? "식재료 물가 정보를 불러오지 못했습니다. 백엔드 실행 여부와 NEXT_PUBLIC_BACKEND_BASE_URL 을 확인해 주세요."
      : null;

  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <HomeClient priceInitialData={priceInitialData} priceInitialError={priceError} />
    </Suspense>
  );
}
