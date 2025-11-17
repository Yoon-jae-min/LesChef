import type { ReactNode } from "react";
import ClientMyPageLayout from "./ClientMyPageLayout";

export default function MyPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ClientMyPageLayout>{children}</ClientMyPageLayout>;
}
