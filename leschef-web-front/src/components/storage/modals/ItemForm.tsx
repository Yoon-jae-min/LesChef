/**
 * 재료 추가/수정 모달 컴포넌트
 */

import Storage from "./Storage";
import ErrorMessage from "@/components/common/ui/ErrorMessage";
import type { FoodItem } from "@/utils/api/foods";

const UNITS = ["개", "팩", "봉지", "모", "컵", "병", "기타"];

interface FoodItemForm {
  name: string;
  volume: number;
  unit: string;
  expirate: string;
}

interface ItemFormProps {
  open: boolean;
  onClose: () => void;
  form: FoodItemForm;
  onFormChange: (field: keyof FoodItemForm, value: string | number) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingItem: FoodItem | null;
  activePlaceName: string;
  error: Error | null;
}

export default function ItemForm({
  open,
  onClose,
  form,
  onFormChange,
  onSubmit,
  editingItem,
  activePlaceName,
  error,
}: ItemFormProps) {
  return (
    <Storage open={open} onClose={onClose}>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Inventory</p>
        <h3 className="text-2xl font-semibold text-gray-900">{editingItem ? "재료 수정" : "새 재료 추가"}</h3>
        <p className="text-sm text-gray-500">
          {activePlaceName
            ? `${activePlaceName}에 보관 중인 재료 정보를 입력해주세요.`
            : "보관 장소를 먼저 추가해주세요."}
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage error={error} showDetails={false} showAction={false} />
        </div>
      )}

      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">재료명</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onFormChange("name", e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:ring-0"
            placeholder="예) 양파"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">수량</label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={form.volume}
              onChange={(e) => onFormChange("volume", Number(e.target.value))}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:ring-0"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">단위</label>
            <select
              value={form.unit}
              onChange={(e) => onFormChange("unit", e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:ring-0"
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">유통기한</label>
          <input
            type="date"
            value={form.expirate}
            onChange={(e) => onFormChange("expirate", e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:ring-0"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {editingItem ? "재료 정보 업데이트" : "재료 추가하기"}
        </button>
      </form>
    </Storage>
  );
}

