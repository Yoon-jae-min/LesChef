/**
 * 네비게이션 아이콘 컴포넌트
 * Top 컴포넌트에서 사용하는 아이콘들을 중앙에서 관리
 */

import React from "react";

interface IconProps {
  className?: string;
}

export const StorageIcon: React.FC<IconProps> = ({ className = "w-6 h-6 text-gray-600" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <rect x="4" y="4" width="16" height="18" rx="2" ry="2" strokeLinecap="round" />
    <path d="M4 10h16" strokeLinecap="round" />
    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" strokeLinecap="round" />
    <circle cx="9" cy="14" r="1" fill="currentColor" />
    <circle cx="15" cy="14" r="1" fill="currentColor" />
  </svg>
);

export const RecipeIcon: React.FC<IconProps> = ({ className = "w-6 h-6 text-gray-600" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M4 13h14v6c0 1-1 2-2 2H6c-1 0-2-1-2-2v-6z" strokeLinecap="round" />
    <path d="M18 13v-2l20-4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 9c1-1 1-2 1-3c1-1 1-2 1-3" strokeLinecap="round" />
    <path d="M10 9c1-1 1-2 1-3c1-1 1-2 1-3" strokeLinecap="round" />
    <path d="M14 9c1-1 1-2 1-3c1-1 1-2 1-3" strokeLinecap="round" />
  </svg>
);

export const MyPageIcon: React.FC<IconProps> = ({ className = "w-6 h-6 text-gray-600" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="9" r="3" />
    <path d="M7 20c2.5-2.5 7.5-2.5 10 0" strokeLinecap="round" />
  </svg>
);

export const BoardIcon: React.FC<IconProps> = ({ className = "w-6 h-6 text-gray-600" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <path d="M7 8h10M7 12h8M7 16h6" strokeLinecap="round" />
  </svg>
);
