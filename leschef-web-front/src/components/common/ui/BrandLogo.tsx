/**
 * LesChef 브랜드 로고 — 시트러스 그린 (잎 + 세리프 워드마크)
 */

import { brandDisplay } from "@/styles/fonts";

interface BrandLogoProps {
  className?: string;
  /** 아이콘만 (파비콘/작은 영역용) */
  iconOnly?: boolean;
  title?: string;
}

function LeafMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient
          id="leschefLeafGrad"
          x1="8"
          y1="32"
          x2="32"
          y2="6"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2E7D32" />
          <stop offset="0.55" stopColor="#66BB6A" />
          <stop offset="1" stopColor="#C5E1A5" />
        </linearGradient>
      </defs>
      <path
        d="M20.2 4.5c-1.2 4.8-1.6 9.2-.7 13.4 1.2 5.4 4.4 9.8 9.2 13.1-4.6.4-9.1-.8-12.8-3.6C11.2 23.8 8.8 18.6 9 12.8c.1-3.2 1.1-6.2 2.8-8.8 2.6 2.1 5.5 3.4 8.4.5Z"
        fill="url(#leschefLeafGrad)"
      />
      <path
        d="M19.6 8.2c.2 4.6.8 8.8 2.6 12.6 1.6 3.4 4 6.2 7.2 8.4"
        stroke="#1B5E20"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M18.2 14.5c2.2 1.1 4.2 2.8 5.8 4.8M16.8 19.2c2.4 1.4 4.5 3.2 6.2 5.4"
        stroke="#F1F8E9"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}

export default function BrandLogo({
  className = "h-10",
  iconOnly = false,
  title = "LesChef",
}: BrandLogoProps) {
  if (iconOnly) {
    return (
      <span className={`inline-flex ${className}`} role="img" aria-label={title}>
        <LeafMark className="h-full w-auto" />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      role="img"
      aria-label={title}
    >
      <LeafMark className="h-[1.85rem] w-[1.85rem] shrink-0 sm:h-8 sm:w-8" />
      <span
        className={`${brandDisplay.className} text-[1.7rem] font-semibold leading-none tracking-[-0.01em] text-[#1B5E20] sm:text-[1.85rem]`}
        style={{ fontFeatureSettings: '"kern" 1, "liga" 1' }}
      >
        LesChef
      </span>
    </span>
  );
}
