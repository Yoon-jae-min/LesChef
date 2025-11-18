"use client";

export default function InfoPage() {
  return (
    <div className="grid gap-6 md:grid-cols-[320px,1fr]">
      <section className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
        <div className="relative overflow-hidden rounded-[24px] border border-gray-200 bg-gradient-to-br from-orange-100 via-rose-100 to-yellow-100 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/70">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-10 w-10 text-gray-500">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c1.5-3 4.5-5 8-5s6.5 2 8 5" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-600">Profile</p>
              <p className="text-2xl font-semibold text-gray-900">user</p>
              <p className="text-sm text-gray-700">나의 LesChef 요리 여정</p>
            </div>
          </div>
          <div className="absolute inset-0 rounded-[24px] border border-gray-200/10" />
        </div>

        <div className="mt-6 space-y-3">
          {["정보확인", "정보변경", "비밀번호 변경"].map((label) => (
            <button
              key={label}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-black"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-[32px] border border-gray-200 bg-white px-6 py-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Inventory Alert</p>
              <h2 className="text-2xl font-semibold text-gray-900">기한 임박 물품</h2>
            </div>
            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500">
              0 items
            </span>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-12 text-center text-sm text-gray-400">
            아직 임박한 재료가 없어요. 재료를 추가하면 여기에서 바로 확인할 수 있어요.
          </div>
        </div>

        <div className="rounded-[32px] border border-gray-200 bg-white px-6 py-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">My Recipes</p>
              <h2 className="text-2xl font-semibold text-gray-900">나의 인기 레시피</h2>
            </div>
            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500">
              준비 중
            </span>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-12 text-center text-sm text-gray-400">
            레시피를 저장하거나 좋아요하면 이곳에 summary가 표시됩니다.
          </div>
        </div>
      </section>
    </div>
  );
}
