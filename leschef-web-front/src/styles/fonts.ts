/**
 * 브랜드·디스플레이 폰트
 * - brand: 로고 워드마크용 세리프 (가볍고 우아한 톤)
 * - 본문은 Pretendard (globals.css)
 */

import { Cormorant_Garamond } from "next/font/google";

export const brandDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-brand-display",
  display: "swap",
});
