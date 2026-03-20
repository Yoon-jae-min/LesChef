/**
 * 보관 장소 이름 변경 모달
 */

import Storage from "./Storage";
import ErrorMessage from "@/components/common/ui/ErrorMessage";

interface RenamePlaceModalProps {
  open: boolean;
  onClose: () => void;
  currentName: string;
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  error: Error | null;
  loading: boolean;
}

export default function RenamePlaceModal({
  open,
  onClose,
  currentName,
  value,
  onValueChange,
  onSubmit,
  error,
  loading,
}: RenamePlaceModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Storage open={open} onClose={onClose}>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Place</p>
        <h3 className="text-2xl font-semibold text-gray-900">보관 장소 이름 변경</h3>
        <p className="text-sm text-gray-500">
          현재 장소: <span className="font-medium text-gray-800">{currentName}</span>
        </p>
      </div>
      {error && (
        <div className="mb-4">
          <ErrorMessage error={error} showDetails={false} showAction={false} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="rename-place-input"
            className="mb-1 block text-xs font-medium text-gray-600"
          >
            새 이름
          </label>
          <input
            id="rename-place-input"
            type="text"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:ring-0"
            placeholder="예) 냉장실"
            disabled={loading}
            autoComplete="off"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "저장 중…" : "저장"}
          </button>
        </div>
      </form>
    </Storage>
  );
}
