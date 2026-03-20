/**
 * 재사용 가능한 모달 컴포넌트
 * 보관 재료 페이지에서 사용
 */

interface StorageProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Storage({ open, onClose, children }: StorageProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] px-4">
      <div className="relative w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
          aria-label="닫기"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
