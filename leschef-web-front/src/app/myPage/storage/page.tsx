"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { TIMING } from "@/constants/system/timing";
import ErrorMessage from "@/components/common/ui/ErrorMessage";
import {
  addFoodItem,
  addStoragePlace,
  deleteFoodItem,
  deleteStoragePlace,
  fetchFoodsList,
  fetchExpiryAlerts,
  updateFoodItem,
  updateStoragePlace,
  uploadFoodItemImage,
  type FoodItem as FoodItemType,
  type FoodsListResponse,
  type StoragePlace,
} from "@/utils/api/foods";
import ExpiryAlerts from "@/components/storage/summary/ExpiryAlerts";
import Place from "@/components/storage/modals/Place";
import RenamePlaceModal from "@/components/storage/modals/RenamePlaceModal";
import ItemForm, { type ItemFormState } from "@/components/storage/modals/ItemForm";
import FoodItem from "@/components/storage/card/FoodItem";

const EMPTY_ITEM_FORM: ItemFormState = {
  name: "",
  volume: 1,
  unit: "개",
  expirate: "",
  serverImageUrl: "",
};

export default function StoragePage() {
  const { data, error, isLoading, mutate } = useSWR<FoodsListResponse>(
    "/foods/place",
    fetchFoodsList,
    {
      revalidateOnFocus: false,
      dedupingInterval: TIMING.ONE_MINUTE,
    }
  );

  // 유통기한 알림 조회
  const { data: alertsData } = useSWR("/foods/expiry-alerts", () => fetchExpiryAlerts("all"), {
    revalidateOnFocus: false,
    dedupingInterval: TIMING.FIVE_MINUTES,
  });

  const places: StoragePlace[] = data?.sectionList || [];

  const [activePlaceId, setActivePlaceId] = useState<string>("");
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);

  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");

  const [isRenamePlaceOpen, setIsRenamePlaceOpen] = useState(false);
  const [renamePlaceValue, setRenamePlaceValue] = useState("");

  const [showDeletePlaceConfirm, setShowDeletePlaceConfirm] = useState(false);
  const [placeActionLoading, setPlaceActionLoading] = useState(false);

  // 액션 에러 상태 관리
  const [actionError, setActionError] = useState<Error | null>(null);

  // 데이터 로드 후 기본 탭 동기화 (MongoDB place 서브도큐먼트 _id)
  useEffect(() => {
    if (!places.length) {
      setActivePlaceId("");
      return;
    }
    const ids = places.map((p) => p._id);
    if (!activePlaceId || !ids.includes(activePlaceId)) {
      setActivePlaceId(ids[0]);
    }
  }, [places, activePlaceId]);

  const activePlace = useMemo(
    () => places.find((p) => p._id === activePlaceId) || null,
    [places, activePlaceId]
  );

  const filteredItems: FoodItemType[] = activePlace?.foodList || [];

  const editingItem = useMemo(() => {
    if (!editingFoodId) return null;
    return filteredItems.find((item) => item._id === editingFoodId) || null;
  }, [editingFoodId, filteredItems]);

  const [form, setForm] = useState<ItemFormState>(EMPTY_ITEM_FORM);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  const handleOpenFoodModal = (item?: FoodItemType) => {
    setPendingImageFile(null);
    setActionError(null);
    if (item) {
      setEditingFoodId(item._id);
      setForm({
        name: item.name ?? "",
        volume: item.volume ?? 0,
        unit: item.unit,
        expirate:
          typeof item.expirate === "string"
            ? item.expirate.slice(0, 10)
            : new Date(item.expirate).toISOString().slice(0, 10),
        serverImageUrl: item.imageUrl?.trim() ?? "",
      });
    } else {
      setEditingFoodId(null);
      setForm({ ...EMPTY_ITEM_FORM });
    }
    setIsFoodModalOpen(true);
  };

  const handleFormChange = (field: keyof ItemFormState, value: string | number) => {
    if (field === "serverImageUrl") return;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError(null);

    try {
      if (!activePlaceId) {
        throw new Error("보관 장소를 먼저 추가해주세요.");
      }

      const hasServerImage = Boolean(form.serverImageUrl?.trim());

      if (!editingItem) {
        if (!pendingImageFile) {
          throw new Error("사진을 선택해주세요.");
        }
        const { imageUrl } = await uploadFoodItemImage(pendingImageFile);
        await mutate(
          () =>
            addFoodItem({
              placeId: activePlaceId,
              imageUrl,
              name: form.name.trim() || undefined,
              volume: Number(form.volume) || 0,
              unit: form.unit,
              expiryDate: form.expirate,
            }),
          { revalidate: false }
        );
      } else {
        if (!hasServerImage && !pendingImageFile) {
          throw new Error("사진이 없는 항목은 새 사진을 선택한 뒤 저장해주세요.");
        }
        let newImageUrl: string | undefined;
        if (pendingImageFile) {
          const { imageUrl } = await uploadFoodItemImage(pendingImageFile);
          newImageUrl = imageUrl;
        }
        await mutate(
          () =>
            updateFoodItem({
              contentId: editingItem._id,
              name: form.name.trim(),
              volume: Number(form.volume) || 0,
              unit: form.unit,
              date: form.expirate,
              ...(newImageUrl ? { imageUrl: newImageUrl } : {}),
            }),
          { revalidate: false }
        );
      }

      setIsFoodModalOpen(false);
      setEditingFoodId(null);
      setPendingImageFile(null);
      setForm({ ...EMPTY_ITEM_FORM });
    } catch (err) {
      setActionError(
        err instanceof Error ? err : new Error("재료 추가/수정 중 오류가 발생했습니다.")
      );
    }
  };

  const handleDelete = async (item: FoodItemType) => {
    if (!item._id) return;
    setActionError(null);

    try {
      await mutate(() => deleteFoodItem(item._id), { revalidate: false });
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
      setActionError(
        err instanceof Error ? err : new Error("보관 장소 추가 중 오류가 발생했습니다.")
      );
    }
  };

  const openRenamePlaceModal = () => {
    if (!activePlaceId || !activePlace) return;
    setActionError(null);
    setRenamePlaceValue(activePlace.name);
    setIsRenamePlaceOpen(true);
  };

  const handleRenamePlaceSubmit = async () => {
    if (!activePlaceId || placeActionLoading) return;
    const nextName = renamePlaceValue.trim();
    if (!nextName) {
      setActionError(new Error("새 장소 이름을 입력해주세요."));
      return;
    }

    setPlaceActionLoading(true);
    setActionError(null);
    try {
      const res = await updateStoragePlace(activePlaceId, nextName);
      if (res.exist) {
        throw new Error("이미 같은 이름의 보관 장소가 있습니다.");
      }
      const fresh = await fetchFoodsList();
      await mutate(fresh, { revalidate: false });
      setIsRenamePlaceOpen(false);
      setRenamePlaceValue("");
    } catch (err) {
      setActionError(
        err instanceof Error ? err : new Error("보관 장소 이름 변경 중 오류가 발생했습니다.")
      );
    } finally {
      setPlaceActionLoading(false);
    }
  };

  const handleConfirmDeletePlace = async () => {
    if (!activePlaceId || placeActionLoading) return;
    setPlaceActionLoading(true);
    setActionError(null);
    try {
      const fresh = await deleteStoragePlace(activePlaceId);
      await mutate(fresh, { revalidate: false });
      setShowDeletePlaceConfirm(false);
    } catch (err) {
      setActionError(
        err instanceof Error ? err : new Error("보관 장소 삭제 중 오류가 발생했습니다.")
      );
    } finally {
      setPlaceActionLoading(false);
    }
  };

  /** 모달 내부에서 actionError 를 보여 줄 때는 상단 배너 중복 방지 */
  const suppressActionErrorBanner =
    isPlaceModalOpen || isFoodModalOpen || isRenamePlaceOpen || showDeletePlaceConfirm;
  const topBannerError = error || (!suppressActionErrorBanner ? actionError : null);
  const activePlaceItemCount = filteredItems.length;

  return (
    <div className="space-y-6">
      <ExpiryAlerts alerts={alertsData} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.4em] text-gray-400">My Fridge</p>
          <h2 className="text-3xl font-semibold text-gray-900">보관 재료 인벤토리</h2>
          <p className="text-sm text-gray-500">
            재료가 얼마나 남았는지, 언제 써야 하는지 한눈에 확인하세요.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaceModalOpen(true)}
            className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
          >
            장소 추가
          </button>
          <button
            type="button"
            onClick={openRenamePlaceModal}
            disabled={!activePlaceId}
            className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            이름 변경
          </button>
          <button
            type="button"
            onClick={() => {
              setActionError(null);
              setShowDeletePlaceConfirm(true);
            }}
            disabled={!activePlaceId}
            className="inline-flex items-center justify-center rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            장소 삭제
          </button>
          <button
            type="button"
            onClick={() => handleOpenFoodModal()}
            disabled={!activePlaceId}
            className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-900 hover:-translate-y-0.5 hover:bg-gray-700 hover:text-white transition disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:transform-none"
          >
            재료 추가하기
          </button>
        </div>
      </div>

      {topBannerError && (
        <ErrorMessage
          error={topBannerError}
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

      {!isLoading && !error && places.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {places.map((p) => {
            const isActive = activePlaceId === p._id;
            return (
              <button
                key={p._id}
                type="button"
                onClick={() => setActivePlaceId(p._id)}
                className={`rounded-full border px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-gray-700 bg-gray-700 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                }`}
                aria-pressed={isActive}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      )}

      {!isLoading && !error && places.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          아직 등록된 보관 장소가 없어요. 상단의{" "}
          <span className="font-medium text-gray-700">장소 추가</span>로 시작해보세요.
        </div>
      ) : !isLoading && !error && filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          아직 {activePlace?.name ?? "이 장소"}에 등록된 재료가 없어요.
        </div>
      ) : !isLoading && !error ? (
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
      ) : null}

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
        error={isPlaceModalOpen ? actionError : null}
      />

      <RenamePlaceModal
        open={isRenamePlaceOpen}
        onClose={() => {
          setIsRenamePlaceOpen(false);
          setActionError(null);
          setRenamePlaceValue("");
        }}
        currentName={activePlace?.name ?? ""}
        value={renamePlaceValue}
        onValueChange={setRenamePlaceValue}
        onSubmit={handleRenamePlaceSubmit}
        error={isRenamePlaceOpen ? actionError : null}
        loading={placeActionLoading}
      />

      {showDeletePlaceConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="w-full max-w-md rounded-[32px] border border-gray-200 bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,0.05)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-place-title"
          >
            <h3
              id="delete-place-title"
              className="text-xl font-semibold text-gray-900 text-center mb-2"
            >
              보관 장소 삭제
            </h3>
            <p className="text-sm text-gray-600 text-center mb-2">
              <span className="font-semibold text-gray-900">{activePlace?.name ?? ""}</span> 장소를
              삭제할까요?
            </p>
            {activePlaceItemCount > 0 ? (
              <p className="text-sm text-red-600 text-center mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
                이 장소에 등록된 재료 <strong>{activePlaceItemCount}개</strong>도 함께 삭제됩니다.
              </p>
            ) : (
              <p className="text-sm text-gray-500 text-center mb-6">등록된 재료가 없습니다.</p>
            )}
            {actionError && showDeletePlaceConfirm && (
              <p className="text-sm text-red-600 text-center mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-2">
                {actionError.message}
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                disabled={placeActionLoading}
                onClick={() => {
                  setShowDeletePlaceConfirm(false);
                  setActionError(null);
                }}
                className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                disabled={placeActionLoading}
                onClick={() => void handleConfirmDeletePlace()}
                className="flex-1 rounded-2xl border border-red-200 bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {placeActionLoading ? "삭제 중…" : "삭제하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ItemForm
        open={isFoodModalOpen}
        onClose={() => {
          setIsFoodModalOpen(false);
          setActionError(null);
          setEditingFoodId(null);
          setPendingImageFile(null);
          setForm({ ...EMPTY_ITEM_FORM });
        }}
        form={form}
        onFormChange={handleFormChange}
        pendingImageFile={pendingImageFile}
        onPendingImageFileChange={setPendingImageFile}
        onSubmit={handleSubmit}
        editingItem={editingItem}
        activePlaceName={activePlace?.name ?? ""}
        error={isFoodModalOpen ? actionError : null}
      />
    </div>
  );
}
