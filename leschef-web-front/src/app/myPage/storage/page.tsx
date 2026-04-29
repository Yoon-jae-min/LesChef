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
  const [isItemSubmitting, setIsItemSubmitting] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

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
    if (isItemSubmitting) return;

    setIsItemSubmitting(true);
    try {
      if (!activePlaceId) {
        throw new Error("보관 장소를 먼저 추가해주세요.");
      }

      const hasServerImage = Boolean(form.serverImageUrl?.trim());
      const trimmedName = form.name.trim();

      if (!editingItem) {
        if (!pendingImageFile && !trimmedName) {
          throw new Error("사진 또는 이름 중 하나는 입력해주세요.");
        }
        let imageUrl: string | undefined;
        if (pendingImageFile) {
          const uploaded = await uploadFoodItemImage(pendingImageFile);
          imageUrl = uploaded.imageUrl;
        }
        await mutate(
          () =>
            addFoodItem({
              placeId: activePlaceId,
              ...(imageUrl ? { imageUrl } : {}),
              name: trimmedName || undefined,
              volume: Number(form.volume) || 0,
              unit: form.unit,
              expiryDate: form.expirate,
            }),
          { revalidate: false }
        );
      } else {
        if (!hasServerImage && !pendingImageFile && !trimmedName) {
          throw new Error("사진이 없을 때는 이름을 입력해주세요.");
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
              name: trimmedName,
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
    } finally {
      setIsItemSubmitting(false);
    }
  };

  const handleDelete = async (item: FoodItemType) => {
    if (!item._id) return;
    setActionError(null);
    if (deletingItemId) return;

    setDeletingItemId(item._id);
    try {
      await mutate(() => deleteFoodItem(item._id), { revalidate: false });
    } catch (err) {
      setActionError(err instanceof Error ? err : new Error("재료 삭제 중 오류가 발생했습니다."));
    } finally {
      setDeletingItemId(null);
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
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-600/90">My Fridge</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            보관 재료 인벤토리
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            재료가 얼마나 남았는지, 언제 써야 하는지 한눈에 확인하세요.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaceModalOpen(true)}
            className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            장소 추가
          </button>
          <button
            type="button"
            onClick={openRenamePlaceModal}
            disabled={!activePlaceId}
            className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
            className="inline-flex items-center justify-center rounded-2xl border border-red-200/90 bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            장소 삭제
          </button>
          <button
            type="button"
            onClick={() => handleOpenFoodModal()}
            disabled={!activePlaceId}
            className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-orange-600"
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
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-stone-300/90 bg-white/90 px-6 py-14 text-center shadow-sm"
          role="status"
          aria-live="polite"
        >
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500" />
          <p className="text-sm text-stone-600">불러오는 중…</p>
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
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                  isActive
                    ? "border-orange-600 bg-orange-600 text-white shadow-sm"
                    : "border-stone-200 bg-white text-stone-700 shadow-sm hover:border-stone-300 hover:bg-stone-50"
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
        <div className="rounded-[28px] border border-dashed border-stone-300/90 bg-stone-50/60 px-6 py-12 text-center text-sm text-stone-600">
          아직 등록된 보관 장소가 없어요. 상단의{" "}
          <span className="font-medium text-stone-800">장소 추가</span>로 시작해보세요.
        </div>
      ) : !isLoading && !error && filteredItems.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-stone-300/90 bg-stone-50/60 px-6 py-12 text-center text-sm text-stone-600">
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
              isDeleting={deletingItemId === item._id}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/45 p-4 backdrop-blur-[2px]">
          <div
            className="w-full max-w-md rounded-[28px] border border-stone-200/90 bg-white p-8 shadow-xl shadow-stone-900/10 ring-1 ring-stone-900/[0.04]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-place-title"
          >
            <h3
              id="delete-place-title"
              className="mb-2 text-center text-xl font-semibold text-stone-900"
            >
              보관 장소 삭제
            </h3>
            <p className="mb-2 text-center text-sm text-stone-600">
              <span className="font-semibold text-stone-900">{activePlace?.name ?? ""}</span> 장소를
              삭제할까요?
            </p>
            {activePlaceItemCount > 0 ? (
              <p className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                이 장소에 등록된 재료 <strong>{activePlaceItemCount}개</strong>도 함께 삭제됩니다.
              </p>
            ) : (
              <p className="mb-6 text-center text-sm text-stone-500">등록된 재료가 없습니다.</p>
            )}
            {actionError && showDeletePlaceConfirm && (
              <p className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-center text-sm text-red-600">
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
                className="flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                disabled={placeActionLoading}
                onClick={() => void handleConfirmDeletePlace()}
                className="flex-1 rounded-2xl border border-red-600 bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
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
        isSubmitting={isItemSubmitting}
        editingItem={editingItem}
        activePlaceName={activePlace?.name ?? ""}
        error={isFoodModalOpen ? actionError : null}
      />
    </div>
  );
}
