import { API_CONFIG } from "@/config/apiConfig";
import { getRefreshToken, setTokens, clearTokens } from "@/utils/helpers/tokenStorage";

export async function refreshTokens(): Promise<{ accessToken: string; refreshToken: string } | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${API_CONFIG.CUSTOMER_API}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    return null;
  }

  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  if (!data?.accessToken || !data?.refreshToken) {
    clearTokens();
    return null;
  }
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
}

