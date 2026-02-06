import type { Metadata } from "next";
import "./globals.css";
import ScrollToTop from "@/components/common/ui/ScrollToTop";
import SWRProvider from "@/components/common/providers/SWRProvider";
import { NotificationProvider } from "@/contexts/Notification";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LesChef - 요리와 식재료의 모든 것",
    template: "%s | LesChef",
  },
  description: "LesChef에서 요리 뉴스와 식재료 물가 정보를 확인하세요.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "LesChef",
    title: "LesChef - 요리와 식재료의 모든 것",
    description:
      "LesChef에서 냉장고를 정리하고, 레시피를 찾고, 식재료 물가 정보를 한 번에 확인하세요.",
    images: [
      {
        url: "/icon/LesChef_Logo.png",
        width: 512,
        height: 512,
        alt: "LesChef 로고",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
};

function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white text-black antialiased">
        <SWRProvider>
          <NotificationProvider>
            {children}
            <ScrollToTop />
          </NotificationProvider>
        </SWRProvider>
      </body>
    </html>
  );
}

export default RootLayout;
