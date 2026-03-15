import { createApiClient } from "@openup/api-client";
import { getToken } from "./tokenStorage";

export const apiClient = createApiClient({
  baseUrl: "http://localhost:3000/api",
  getToken,
});
