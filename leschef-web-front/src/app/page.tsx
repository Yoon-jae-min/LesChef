import HomeClient from "@/components/home/HomeClient";
import { Suspense } from "react";

/**
 * 메인 페이지 (서버 컴포넌트)
 * 서버에서 초기 데이터를 가져와서 렌더링
 * 클라이언트 컴포넌트는 로딩 애니메이션과 실시간 업데이트를 위해 사용
 */
export default async function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <HomeClient />
    </Suspense>
  );
}
