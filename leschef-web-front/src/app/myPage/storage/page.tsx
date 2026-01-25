"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from "react";
import FilterTabs from "@/components/common/ui/FilterTabs";
import useSWR from "swr";
import { TIMING } from "@/constants/system/timing";
import ErrorMessage from "@/components/common/ui/ErrorMessage";
import {
  addFoodItem,
  addStoragePlace,
  deleteFoodItem,
  fetchFoodsList,
  fetchExpiryAlerts,
  updateFoodItem,
  type FoodItem as FoodItemType,
  type FoodsListResponse,
  type StoragePlace,
} from "@/utils/api/foods";
import Storage from "@/components/storage/modals/Storage";
import ExpiryAlerts from "@/components/storage/summary/ExpiryAlerts";
import Place from "@/components/storage/modals/Place";
import ItemForm from "@/components/storage/modals/ItemForm";
import FoodItem from "@/components/storage/card/FoodItem";

export default function StoragePage() {
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<FoodsListResponse>("/foods/place", fetchFoodsList, {
    revalidateOnFocus: false,
    dedupingInterval: TIMING.ONE_MINUTE,
  });

  // 유통기한 알림 조회
  const {
    data: alertsData,
  } = useSWR("/foods/expiry-alerts", () => fetchExpiryAlerts("all"), {
    revalidateOnFocus: false,
    dedupingInterval: TIMING.FIVE_MINUTES,
  });

  const places: StoragePlace[] = data?.sectionList || [];
  const placeNames = useMemo(() => places.map((p) => p.name), [places]);

  const [activePlaceName, setActivePlaceName] = useState<string>("");
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);

  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");

  // 액션 에러 상태 관리
  const [actionError, setActionError] = useState<Error | null>(null);

  // 데이터 로드 후 기본 탭 동기화
  useEffect(() => {
    if (!placeNames.length) {
      setActivePlaceName("");
      return;
    }
    if (!activePlaceName || !placeNames.includes(activePlaceName)) {
      setActivePlaceName(placeNames[0]);
    }
  }, [placeNames, activePlaceName]);

  const activePlace = useMemo(
    () => places.find((p) => p.name === activePlaceName) || null,
    [places, activePlaceName]
  );

  const filteredItems: FoodItemType[] = activePlace?.foodList || [];

  const editingItem = useMemo(() => {
    if (!editingFoodId) return null;
    return filteredItems.find((item) => item._id === editingFoodId) || null;
  }, [editingFoodId, filteredItems]);

  const [form, setForm] = useState<{
    name: string;
    volume: number;
    unit: string;
    expirate: string;
  }>({
    name: "",
    volume: 1,
    unit: "개",
    expirate: "",
  });

  const handleOpenFoodModal = (item?: FoodItemType) => {
    if (item) {
      setEditingFoodId(item._id);
      setForm({
        name: item.name,
        volume: item.volume ?? 0,
        unit: item.unit,
        expirate: typeof item.expirate === "string" ? item.expirate.slice(0, 10) : new Date(item.expirate).toISOString().slice(0, 10),
      });
    } else {
      setEditingFoodId(null);
      setForm({
        name: "",
        volume: 1,
        unit: "개",
        expirate: "",
      });
    }
    setIsFoodModalOpen(true);
  };

  const handleFormChange = (field: "name" | "volume" | "unit" | "expirate", value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError(null);

    try {
      if (!activePlaceName) {
        throw new Error("보관 장소를 먼저 추가해주세요.");
      }

      const name = form.name.trim();
      if (!name) throw new Error("재료명을 입력해주세요.");

      // 백엔드 삭제가 name 기반이라 중복 방지(안전성/유지보수성)
      const isDuplicateName =
        !editingItem &&
        filteredItems.some((it) => it.name.trim() === name);
      if (isDuplicateName) {
        throw new Error("같은 보관 장소에 동일한 재료명이 이미 존재합니다.");
      }

      if (editingItem) {
        await mutate(
          () =>
            updateFoodItem(
              activePlaceName,
              editingItem._id,
              name,
              Number(form.volume) || 0,
              form.unit,
              form.expirate
            ),
          { revalidate: false }
        );
      } else {
        await mutate(
          () =>
            addFoodItem(
              activePlaceName,
              name,
              Number(form.volume) || 0,
              form.unit,
              form.expirate
            ),
          { revalidate: false }
        );
      }

      setIsFoodModalOpen(false);
      setForm({
        name: "",
        volume: 1,
        unit: "개",
        expirate: "",
      });
    } catch (err) {
      setActionError(err instanceof Error ? err : new Error("재료 추가/수정 중 오류가 발생했습니다."));
    }
  };

  const handleDelete = async (item: FoodItemType) => {
    if (!activePlaceName) return;
    setActionError(null);

    try {
      await mutate(() => deleteFoodItem(activePlaceName, item.name), { revalidate: false });
    } catch (err) {
      setActionError(err instanceof Error ? err : new Error("재료 삭제 중 오류가 발생했습니다."));
    }
  };

  const handleAddPlace = async () => {
    setActionError(null);

    try {
      const placeName = newPlaceName.trim();
      if (!placeName) throw new Error("보관 장소 이름을 입력해주세요.");
      await mutate(() => addStoragePlace(placeName), { revalidate: false });
      setNewPlaceName("");
      setIsPlaceModalOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err : new Error("보관 장소 추가 중 오류가 발생했습니다."));
    }
  };

  const displayError = error || actionError;

  return (
    <div className="space-y-6">
      <ExpiryAlerts alerts={alertsData} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.4em] text-gray-400">My Fridge</p>
          <h2 className="text-3xl font-semibold text-gray-900">보관 재료 인벤토리</h2>
          <p className="text-sm text-gray-500">재료가 얼마나 남았는지, 언제 써야 하는지 한눈에 확인하세요.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaceModalOpen(true)}
            className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
          >
            장소 추가
          </button>
          <button
            onClick={() => handleOpenFoodModal()}
            disabled={!activePlaceName}
            className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-900 hover:-translate-y-0.5 hover:bg-gray-700 hover:text-white transition disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:transform-none"
          >
            재료 추가하기
          </button>
        </div>
      </div>

      {displayError && (
        <ErrorMessage
          error={displayError}
          showDetails={false}
          showAction={true}
          onRetry={() => {
            setActionError(null);
            mutate();
          }}
        />
      )}

      {isLoading && (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          불러오는 중...
        </div>
      )}

      {!isLoading && !displayError && placeNames.length > 0 && (
        <FilterTabs
          items={placeNames}
          activeItem={activePlaceName}
          onItemChange={(item) => setActivePlaceName(item)}
          variant="gray"
        />
      )}

      {!isLoading && !displayError && placeNames.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          아직 등록된 보관 장소가 없어요. 상단의 <span className="font-medium text-gray-700">장소 추가</span>로 시작해보세요.
        </div>
      ) : !isLoading && !displayError && filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          아직 {activePlaceName}에 등록된 재료가 없어요.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredItems.map((item) => (
            <FoodItem
              key={item._id}
              item={item}
              onEdit={handleOpenFoodModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Place
        open={isPlaceModalOpen}
        onClose={() => {
          setIsPlaceModalOpen(false);
          setActionError(null);
          setNewPlaceName("");
        }}
        placeName={newPlaceName}
        onPlaceNameChange={setNewPlaceName}
        onSubmit={handleAddPlace}
        error={actionError}
      />

      <ItemForm
        open={isFoodModalOpen}
        onClose={() => {
          setIsFoodModalOpen(false);
          setActionError(null);
          setForm({
            name: "",
            volume: 1,
            unit: "개",
            expirate: "",
          });
        }}
        form={form}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        editingItem={editingItem}
        activePlaceName={activePlaceName}
        error={actionError}
      />
    </div>
  );
}
