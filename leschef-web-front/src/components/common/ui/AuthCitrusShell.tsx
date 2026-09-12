/**
 * 인증/법적 페이지용 풀페이지 시트러스 배경 셸
 */

import Top from "@/components/common/navigation/Top";
import CitrusDecor from "./CitrusDecor";

interface AuthCitrusShellProps {
  children: React.ReactNode;
  /** Top 네비게이션 표시 (기본 true) */
  showTop?: boolean;
}

export default function AuthCitrusShell({ children, showTop = true }: AuthCitrusShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF9E8]">
      <CitrusDecor className="opacity-90" />
      {showTop ? <Top /> : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
