import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "식재료 물가",
  description: "공공 식재료 가격 정보를 한눈에 확인하세요.",
};

export default function IngredientPriceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
