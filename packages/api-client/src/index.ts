import type { ApiResponse } from "@openup/types";

export interface ApiClientOptions {
  baseUrl: string;
  getToken?: () => Promise<string | null> | string | null;
}

export function createApiClient(options: ApiClientOptions) {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = options.getToken ? await options.getToken() : null;
    const res = await fetch(`${options.baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {}),
      },
    });

    const payload = (await res.json()) as ApiResponse<T>;
    if (!res.ok || payload.error) {
      throw new Error(payload.error || `Request failed: ${res.status}`);
    }
    return payload.data;
  }

  return {
    get: <T>(path: string) => request<T>(path),
    post: <T, B = unknown>(path: string, body: B) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
    patch: <T, B = unknown>(path: string, body: B) =>
      request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  };
}
