/**
 * 보관함 항목 카드 — 이미지 중심, 이름 선택
 */

import Image from "next/image";
import Link from "next/link";
import type { FoodItem } from "@/utils/api/foods";
import { getDday, getPriority, formatDday, formatExpiryYmd } from "@/utils/helpers/storageUtils";
import { resolveBackendAssetUrl } from "@/utils/helpers/imageUtils";

interface FoodItemProps {
  item: FoodItem;
  onEdit: (item: FoodItem) => void;
  onDelete: (item: FoodItem) => void;
  isDeleting?: boolean;
}

export default function FoodItem({ item, onEdit, onDelete, isDeleting = false }: FoodItemProps) {
  const expirateStr = formatExpiryYmd(item.expirate);
  const dday =
    typeof item.daysUntilExpiry === "number" ? item.daysUntilExpiry : getDday(expirateStr);
  const priority = getPriority(dday);

  const nameTrimmed = item.name?.trim() ?? "";
  const title = nameTrimmed || "이름 없음";
  const canFindRecipes = nameTrimmed.length > 0;
  const recipeSearchHref = `/recipe/all?keyword=${encodeURIComponent(nameTrimmed)}`;
  const imgSrc = item.imageUrl ? resolveBackendAssetUrl(item.imageUrl) : "";

  return (
    <div className="relative rounded-3xl border border-gray-200 bg-white p-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 sm:h-28 sm:w-28">
          {imgSrc ? (
            <Image src={imgSrc} alt={title} fill className="object-cover" sizes="200px" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              사진 없음
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Item</p>
              <h3 className="text-xl font-semibold text-gray-900 sm:text-2xl">{title}</h3>
              <p className="text-sm text-gray-500">
                {item.volume}
                {item.unit}
              </p>
            </div>
            <div className={`shrink-0 rounded-full border px-4 py-1 text-xs font-medium ${priority.tone}`}>
              {priority.label}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">유통기한</p>
              <p
                className={`font-medium ${dday !== null && dday < 3 ? "text-orange-600" : "text-gray-900"}`}
              >
                {expirateStr || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">D-Day</p>
              <p
                className={`font-semibold ${dday !== null && dday < 0 ? "text-red-600" : "text-gray-900"}`}
              >
                {formatDday(dday)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onEdit(item)}
          disabled={isDeleting}
          className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-black"
        >
          수정
        </button>
        <button
          type="button"
          onClick={() => onDelete(item)}
          disabled={isDeleting}
          className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-red-500 hover:text-red-600"
        >
          {isDeleting ? "삭제 중…" : "삭제"}
        </button>
        {canFindRecipes ? (
          <Link
            href={recipeSearchHref}
            className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-green-500 hover:text-green-600 text-center"
          >
            레시피 찾기
          </Link>
        ) : (
          <button
            type="button"
            disabled
            title="이름을 입력하면 레시피 검색에 사용할 수 있어요."
            aria-label="이름을 입력하면 레시피 검색에 사용할 수 있어요."
            className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60"
          >
            레시피 찾기
          </button>
        )}
      </div>
    </div>
  );
}
