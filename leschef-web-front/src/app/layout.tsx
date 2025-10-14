import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LesChef - 요리와 식재료의 모든 것",
  description: "LesChef에서 요리 뉴스와 식재료 물가 정보를 확인하세요",
};

function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white text-black antialiased">
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
