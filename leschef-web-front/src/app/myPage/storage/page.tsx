"use client";

import { useMemo, useState } from "react";
import FilterTabs from "@/components/common/FilterTabs";

type StorageZone = "냉장실" | "냉동실" | "야채칸" | "실온" | "기타";

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  expiryDate: string;
  memo?: string;
};

type InventoryMap = Record<StorageZone, InventoryItem[]>;

const STORAGE_ZONES: StorageZone[] = ["냉장실", "냉동실", "야채칸", "실온", "기타"];

const SAMPLE_INVENTORY: InventoryMap = {
  냉장실: [
    {
      id: "1",
      name: "방울토마토",
      quantity: 1,
      unit: "팩",
      purchaseDate: "2025-01-15",
      expiryDate: "2025-01-25",
    },
    {
      id: "2",
      name: "두부",
      quantity: 2,
      unit: "모",
      purchaseDate: "2025-01-21",
      expiryDate: "2025-01-28",
    },
  ],
  냉동실: [
    {
      id: "3",
      name: "닭가슴살",
      quantity: 5,
      unit: "팩",
      purchaseDate: "2025-01-10",
      expiryDate: "2025-03-10",
    },
  ],
  야채칸: [
    {
      id: "4",
      name: "양파",
      quantity: 3,
      unit: "개",
      purchaseDate: "2025-01-12",
      expiryDate: "2025-02-05",
    },
  ],
  실온: [
    {
      id: "5",
      name: "감자",
      quantity: 6,
      unit: "개",
      purchaseDate: "2025-01-09",
      expiryDate: "2025-02-01",
    },
  ],
  기타: [],
};

const UNITS = ["개", "팩", "봉지", "모", "컵", "병", "기타"];

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const getDday = (dateStr: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((target.getTime() - today.getTime()) / MS_PER_DAY);
  if (Number.isNaN(diffDays)) return null;
  return diffDays;
};

const getPriority = (dday: number | null) => {
  if (dday === null) return { label: "정보 없음", tone: "bg-gray-100 text-gray-500 border-gray-200" };
  if (dday < 0) return { label: "폐기 필요", tone: "bg-red-50 text-red-600 border-red-200" };
  if (dday <= 2) return { label: "긴급", tone: "bg-orange-50 text-orange-600 border-orange-200" };
  if (dday <= 5) return { label: "주의", tone: "bg-yellow-50 text-yellow-600 border-yellow-200" };
  return { label: "안정", tone: "bg-green-50 text-green-600 border-green-200" };
};

const Modal = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] px-4">
      <div className="relative w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
          aria-label="닫기"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default function StoragePage() {
  const [activePlace, setActivePlace] = useState<StorageZone>("냉장실");
  const [inventory, setInventory] = useState<InventoryMap>(SAMPLE_INVENTORY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const editingItem = useMemo(() => {
    if (!editingItemId) return null;
    return inventory[activePlace].find((item) => item.id === editingItemId) || null;
  }, [editingItemId, inventory, activePlace]);

  const [form, setForm] = useState<Omit<InventoryItem, "id">>({
    name: "",
    quantity: 1,
    unit: "개",
    purchaseDate: "",
    expiryDate: "",
    memo: "",
  });

  const filteredItems = inventory[activePlace];

  const handleOpenModal = (item?: InventoryItem) => {
    if (item) {
      setEditingItemId(item.id);
      setForm({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        purchaseDate: item.purchaseDate,
        expiryDate: item.expiryDate,
        memo: item.memo,
      });
    } else {
      setEditingItemId(null);
      setForm({
        name: "",
        quantity: 1,
        unit: "개",
        purchaseDate: "",
        expiryDate: "",
        memo: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newItem: InventoryItem = {
      id: editingItemId ?? crypto.randomUUID(),
      ...form,
    };

    setInventory((prev) => {
      const list = prev[activePlace];
      const existingIndex = list.findIndex((item) => item.id === editingItemId);
      let nextList: InventoryItem[];
      if (existingIndex >= 0) {
        nextList = [...list];
        nextList[existingIndex] = newItem;
      } else {
        nextList = [...list, newItem];
      }
      return { ...prev, [activePlace]: nextList };
    });

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setInventory((prev) => ({
      ...prev,
      [activePlace]: prev[activePlace].filter((item) => item.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.4em] text-gray-400">My Fridge</p>
          <h2 className="text-3xl font-semibold text-gray-900">보관 재료 인벤토리</h2>
          <p className="text-sm text-gray-500">재료가 얼마나 남았는지, 언제 써야 하는지 한눈에 확인하세요.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-900 hover:-translate-y-0.5 hover:bg-gray-700 hover:text-white transition"
        >
          재료 추가하기
        </button>
      </div>

      <FilterTabs 
        items={STORAGE_ZONES} 
        activeItem={activePlace} 
        onItemChange={(item) => setActivePlace(item as StorageZone)} 
        variant="gray" 
      />

      {filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          아직 {activePlace}에 등록된 재료가 없어요.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredItems.map((item) => {
            const dday = getDday(item.expiryDate);
            const priority = getPriority(dday);
            return (
              <div key={item.id} className="relative rounded-3xl border border-gray-200 bg-white p-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Ingredient</p>
                    <h3 className="text-2xl font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.quantity}
                      {item.unit}
                    </p>
                  </div>
                  <div className={`rounded-full border px-4 py-1 text-xs font-medium ${priority.tone}`}>{priority.label}</div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">구매일</p>
                    <p className="font-medium text-gray-900">{item.purchaseDate || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">유통기한</p>
                    <p className={`font-medium ${dday !== null && dday < 3 ? "text-orange-600" : "text-gray-900"}`}>
                      {item.expiryDate || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">D-Day</p>
                    <p className={`font-semibold ${dday !== null && dday < 0 ? "text-red-600" : "text-gray-900"}`}>
                      {dday === null ? "-" : dday === 0 ? "D-DAY" : dday > 0 ? `D-${dday}` : `D+${Math.abs(dday)}`}
                    </p>
                  </div>
                </div>

                {item.memo && (
                  <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600">{item.memo}</div>
                )}

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-black transition"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
          })}
        </div>
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Inventory</p>
          <h3 className="text-2xl font-semibold text-gray-900">{editingItem ? "재료 수정" : "새 재료 추가"}</h3>
          <p className="text-sm text-gray-500">{activePlace}에 보관 중인 재료 정보를 입력해주세요.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">재료명</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
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
                value={form.quantity}
                onChange={(e) => setForm((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:ring-0"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">단위</label>
              <select
                value={form.unit}
                onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">구매일</label>
              <input
                type="date"
                value={form.purchaseDate}
                onChange={(e) => setForm((prev) => ({ ...prev, purchaseDate: e.target.value }))}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">유통기한</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm((prev) => ({ ...prev, expiryDate: e.target.value }))}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:ring-0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">메모 (선택)</label>
            <textarea
              value={form.memo}
              onChange={(e) => setForm((prev) => ({ ...prev, memo: e.target.value }))}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:ring-0"
              rows={3}
              placeholder="레시피 계획, 손질 상태 등 자유롭게 기록하세요."
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            {editingItem ? "재료 정보 업데이트" : "재료 추가하기"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
