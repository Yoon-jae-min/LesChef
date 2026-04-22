"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setTokens } from "@/utils/helpers/tokenStorage";
import { STORAGE_KEYS } from "@/constants/storage/storageKeys";

function parseHashParams(hash: string): Record<string, string> {
  const h = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(h);
  const out: Record<string, string> = {};
  params.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}

export default function SocialCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const params = parseHashParams(window.location.hash);
    const accessToken = params.accessToken;
    const refreshToken = params.refreshToken;

    if (accessToken && refreshToken) {
      setTokens({ accessToken, refreshToken });
      // legacy flags cleanup
      try {
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, "true");
        if (params.userId) {
          localStorage.setItem(
            STORAGE_KEYS.CURRENT_USER,
            JSON.stringify({
              id: params.userId,
              name: params.name,
              nickName: params.nickName,
              tel: params.tel,
            })
          );
        }
      } catch {
        // ignore
      }
      window.history.replaceState(null, "", "/");
      router.replace("/");
      return;
    }

    router.replace("/login");
  }, [router]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-16">
      <div className="flex flex-col items-center gap-3">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500" />
        <p className="text-sm text-stone-600">로그인 처리 중…</p>
      </div>
    </main>
  );
}

