/**
 * 보관 장소 추가 모달 컴포넌트
 */

import Storage from "./Storage";
import ErrorMessage from "@/components/common/ui/ErrorMessage";

interface PlaceProps {
  open: boolean;
  onClose: () => void;
  placeName: string;
  onPlaceNameChange: (value: string) => void;
  onSubmit: () => void;
  error: Error | null;
}

export default function Place({
  open,
  onClose,
  placeName,
  onPlaceNameChange,
  onSubmit,
  error,
}: PlaceProps) {
  return (
    <Storage open={open} onClose={onClose}>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Place</p>
        <h3 className="text-2xl font-semibold text-gray-900">보관 장소 추가</h3>
        <p className="text-sm text-gray-500">예) 냉장실, 냉동실, 야채칸 등</p>
      </div>
      {error && (
        <div className="mb-4">
          <ErrorMessage error={error} showDetails={false} showAction={false} />
        </div>
      )}
      <div className="space-y-4">
        <input
          type="text"
          value={placeName}
          onChange={(e) => onPlaceNameChange(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:ring-0"
          placeholder="보관 장소 이름"
        />
        <button
          type="button"
          onClick={onSubmit}
          className="w-full rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          장소 추가하기
        </button>
      </div>
    </Storage>
  );
}

