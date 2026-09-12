/**
 * 시트러스 레몬/라임 장식 (수채화 느낌 SVG)
 */

export default function CitrusDecor({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <svg
        className="absolute -left-4 top-2 h-28 w-28 opacity-80 md:h-36 md:w-36"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="70" fill="#F6E27A" fillOpacity="0.55" />
        <circle cx="100" cy="100" r="48" fill="#FFF8C9" fillOpacity="0.9" />
        <path
          d="M100 52 L108 100 L100 148 L92 100 Z M52 100 L100 108 L148 100 L100 92 Z"
          fill="#E8C84A"
          fillOpacity="0.35"
        />
      </svg>
      <svg
        className="absolute -right-2 bottom-0 h-24 w-24 opacity-75 md:h-32 md:w-32"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="68" fill="#B7E36A" fillOpacity="0.5" />
        <circle cx="100" cy="100" r="46" fill="#EAF8C8" fillOpacity="0.95" />
        <path
          d="M100 54 L107 100 L100 146 L93 100 Z M54 100 L100 107 L146 100 L100 93 Z"
          fill="#7BC24A"
          fillOpacity="0.3"
        />
      </svg>
      <svg
        className="absolute right-16 top-4 hidden h-20 w-20 opacity-60 md:block"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="55" fill="#DFF59A" fillOpacity="0.55" />
      </svg>
    </div>
  );
}
