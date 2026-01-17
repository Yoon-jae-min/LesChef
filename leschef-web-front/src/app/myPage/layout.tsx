import type { ReactNode } from "react";
import MyPageLayoutClient from "./MyPageLayout";

export default function MyPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <MyPageLayoutClient>{children}</MyPageLayoutClient>;
}
