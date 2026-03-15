import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "openup_token";

export const setToken = (t: string): Promise<void> =>
  SecureStore.setItemAsync(TOKEN_KEY, t);

export const getToken = (): Promise<string | null> =>
  SecureStore.getItemAsync(TOKEN_KEY);

export const clearToken = (): Promise<void> =>
  SecureStore.deleteItemAsync(TOKEN_KEY);
