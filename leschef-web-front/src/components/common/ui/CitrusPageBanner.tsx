/**
 * 페이지 상단 시트러스 배너 (레시피/게시판/마이페이지 공통)
 */

import CitrusDecor from "./CitrusDecor";

interface CitrusPageBannerProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  /** compact: 마이페이지 등 짧은 배너 */
  size?: "default" | "compact";
}

export default function CitrusPageBanner({
  eyebrow,
  title,
  description,
  children,
  size = "default",
}: CitrusPageBannerProps) {
  const pad = size === "compact" ? "py-10 md:py-12" : "py-12 md:py-14";

  return (
    <section
      className={`relative overflow-hidden bg-[#FFF9E8] ${pad}`}
      aria-labelledby="citrus-page-banner-title"
    >
      <CitrusDecor />
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-600/90">
          {eyebrow}
        </p>
        <h1
          id="citrus-page-banner-title"
          className="mt-2 text-3xl font-semibold tracking-tight text-[#1B5E20] sm:text-4xl"
        >
          {title}
        </h1>
        {description ? (
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600 sm:text-base">{description}</p>
        ) : null}
        {children ? <div className="mx-auto mt-6 max-w-2xl">{children}</div> : null}
      </div>
    </section>
  );
}
