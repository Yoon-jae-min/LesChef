/**
 * 보관함 항목 추가/수정 — 사진 또는 이름 중 최소 하나
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Storage from "./Storage";
import ErrorMessage from "@/components/common/ui/ErrorMessage";
import type { FoodItem } from "@/utils/api/foods";
import { resolveBackendAssetUrl } from "@/utils/helpers/imageUtils";

const UNITS = ["개", "팩", "봉지", "모", "컵", "병", "기타"];

export type ItemFormState = {
  name: string;
  volume: number;
  unit: string;
  expirate: string;
  /** 서버에 이미 반영된 이미지 URL (수정 시) */
  serverImageUrl: string;
};

interface ItemFormProps {
  open: boolean;
  onClose: () => void;
  form: ItemFormState;
  onFormChange: (field: keyof ItemFormState, value: string | number) => void;
  /** 로컬에서 고른 새 이미지 파일 (선택) */
  pendingImageFile: File | null;
  onPendingImageFileChange: (file: File | null) => void;
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
  pendingImageFile,
  onPendingImageFileChange,
  onSubmit,
  editingItem,
  activePlaceName,
  error,
}: ItemFormProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingImageFile) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(pendingImageFile);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingImageFile]);

  const previewSrc = objectUrl
    ? objectUrl
    : form.serverImageUrl
      ? resolveBackendAssetUrl(form.serverImageUrl)
      : "";

  const isNew = !editingItem;
  const hasServerImage = Boolean(form.serverImageUrl?.trim());
  const hasImage = Boolean(pendingImageFile || hasServerImage);
  const nameFilled = Boolean(form.name?.trim());
  /** 신규: 사진 또는 이름 / 수정: (기존·신규) 사진이 있거나 이름이 있어야 저장 가능 */
  const canSubmit = hasImage || nameFilled;
  const requirementHint = !canSubmit;

  return (
    <Storage open={open} onClose={onClose}>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Inventory</p>
        <h3 className="text-2xl font-semibold text-gray-900">
          {editingItem ? "항목 수정" : "새 항목 추가"}
        </h3>
        <p className="text-sm text-gray-500">
          {activePlaceName
            ? `${activePlaceName}에 보관할 품목입니다. 사진과 이름 중 최소 하나는 입력해주세요.`
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
          <label className="text-sm font-medium text-gray-700">사진 (선택)</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="w-full text-sm text-gray-700 file:mr-3 file:rounded-xl file:border file:border-gray-200 file:bg-gray-50 file:px-4 file:py-2"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              onPendingImageFileChange(f);
            }}
          />
          <p className="text-xs text-gray-500">
            웹에서는 기기에서 이미지를 선택합니다. (앱에서는 촬영·갤러리와 동일 API)
          </p>
          {requirementHint && (
            <p className="text-xs text-amber-700">
              {isNew
                ? "사진을 넣지 않으면 재료 이름을 입력해주세요."
                : "사진이 없으면 이름을 입력한 뒤 저장할 수 있습니다."}
            </p>
          )}
        </div>

        {previewSrc ? (
          <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
            <Image
              src={previewSrc}
              alt="미리보기"
              fill
              className="object-cover"
              unoptimized={previewSrc.startsWith("blob:")}
            />
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
            미리보기 없음
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">이름 (사진 없을 때 필수)</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onFormChange("name", e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:ring-0"
            placeholder="사진만 넣어도 되고, 둘 다 넣어도 됩니다"
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
          disabled={!canSubmit}
          className="w-full rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {editingItem ? "저장하기" : "추가하기"}
        </button>
      </form>
    </Storage>
  );
}
