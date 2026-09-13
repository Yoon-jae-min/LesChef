/**
 * LesChef 브랜드 로고
 * - 헤더(F): 라인 잎 + 산세리프 워드마크
 * - 아이콘(D): LC 모노그램 + 잎 (파비콘/작은 영역)
 */

interface BrandLogoProps {
  className?: string;
  /** LC 모노그램만 */
  iconOnly?: boolean;
  title?: string;
}

const BRAND = "#1B5E20";

/** F 시안 — 아웃라인 잎 */
function OutlineLeaf({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* 닫힌 잎 윤곽 */}
      <path
        d="M12 3.5C9.5 6.2 7.8 9.5 7.5 13c-.3 3.2 1.2 6.2 3.8 7.8 1.1.7 2.3.7 3.4 0 2.6-1.6 4.1-4.6 3.8-7.8C18.2 9.5 16.5 6.2 14 3.5c-.6-.7-1.4-.7-2 0Z"
        stroke={BRAND}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* 중앙 잎맥 */}
      <path
        d="M12 5.5v14"
        stroke={BRAND}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* 옆 잎맥 */}
      <path
        d="M12 10.5c-1.4.8-2.4 1.8-3 3M12 14c1.4.8 2.4 1.8 3 3"
        stroke={BRAND}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** D 시안 — LC 모노그램 */
function MonogramLC({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* L stem */}
      <path
        d="M18 12v32c0 4.4 3.6 8 8 8h6"
        stroke={BRAND}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* C arc interlocking with L base */}
      <path
        d="M46 20.5c-2.2-3.6-6.2-6-10.8-6-7.2 0-13 5.8-13 13s5.8 13 13 13c4.2 0 7.9-2 10.2-5.1"
        stroke={BRAND}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Leaf accent in C opening */}
      <path
        d="M42.5 36.5c1.6-2.8 1.2-5.6-.2-7.2-1.8 1.4-3.2 3.4-3.6 5.6-.2 1.2.4 2.4 1.4 3 1 .6 1.8.2 2.4-1.4Z"
        fill={BRAND}
      />
      <path
        d="M40.2 31.2c.4 1.4.9 2.6 1.8 3.8"
        stroke="#E8F5E9"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export default function BrandLogo({
  className = "",
  iconOnly = false,
  title = "LesChef",
}: BrandLogoProps) {
  if (iconOnly) {
    return (
      <span className={`inline-flex items-center justify-center ${className}`} role="img" aria-label={title}>
        <MonogramLC className="h-full w-full" />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      role="img"
      aria-label={title}
    >
      <OutlineLeaf className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
      <span className="text-[1.35rem] font-semibold leading-none tracking-[-0.02em] text-[#1B5E20] sm:text-[1.5rem]">
        LesChef
      </span>
    </span>
  );
}

export { MonogramLC, OutlineLeaf };
