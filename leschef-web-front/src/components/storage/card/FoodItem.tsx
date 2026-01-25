/**
 * 재료 카드 컴포넌트
 */

import type { FoodItem } from "@/utils/api/foods";
import { getDday, getPriority, formatDday } from "@/utils/helpers/storageUtils";

interface FoodItemProps {
  item: FoodItem;
  onEdit: (item: FoodItem) => void;
  onDelete: (item: FoodItem) => void;
}

export default function FoodItem({ item, onEdit, onDelete }: FoodItemProps) {
  const expirateStr =
    typeof item.expirate === "string"
      ? item.expirate
      : new Date(item.expirate).toISOString().slice(0, 10);
  const dday = typeof item.daysUntilExpiry === "number" ? item.daysUntilExpiry : getDday(expirateStr);
  const priority = getPriority(dday);

  return (
    <div className="relative rounded-3xl border border-gray-200 bg-white p-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Ingredient</p>
          <h3 className="text-2xl font-semibold text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500">
            {item.volume}
            {item.unit}
          </p>
        </div>
        <div className={`rounded-full border px-4 py-1 text-xs font-medium ${priority.tone}`}>
          {priority.label}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">유통기한</p>
          <p className={`font-medium ${dday !== null && dday < 3 ? "text-orange-600" : "text-gray-900"}`}>
            {expirateStr || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">D-Day</p>
          <p className={`font-semibold ${dday !== null && dday < 0 ? "text-red-600" : "text-gray-900"}`}>
            {formatDday(dday)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <button
          onClick={() => onEdit(item)}
          className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-black transition"
        >
          수정
        </button>
        <button
          onClick={() => onDelete(item)}
          className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-red-500 hover:text-red-600 transition"
        >
          삭제
        </button>
        <button
          type="button"
          className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-green-500 hover:text-green-600 transition"
        >
          레시피 찾기
        </button>
      </div>
    </div>
  );
}

