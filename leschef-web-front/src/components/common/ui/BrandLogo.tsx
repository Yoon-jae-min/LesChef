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
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M16 4.5c-1.2 3.8-1.4 7.4-.4 10.8 1.2 4.2 4.1 7.6 8.4 10.1-3.8.2-7.5-.9-10.4-3.2C10.2 19.2 8.2 15.2 8.4 10.6c.1-2.6 1-5.1 2.6-7.2 1.8 1.6 3.7 2.5 5 1.1Z"
        stroke={BRAND}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M15.6 7.2c.15 3.6.7 6.9 2.2 9.8 1.3 2.6 3.2 4.7 5.7 6.4"
        stroke={BRAND}
        strokeWidth="1.5"
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
