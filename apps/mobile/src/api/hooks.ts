/**
 * Data fetching hooks for the OpenUpHealth mobile app.
 *
 * useQuery       — fetches data on mount and provides refetch capability
 * useMutation    — provides a mutate function for POST/PATCH operations
 * useQueryOnDemand — like useQuery but does not fetch automatically on mount
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "./client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QueryState<T> {
  /** The fetched data, or null if not yet loaded or an error occurred. */
  data: T | null;
  /** True while a fetch is in progress. */
  isLoading: boolean;
  /** Error message if the last fetch failed, otherwise null. */
  error: string | null;
  /** Manually trigger a new fetch. Returns a promise that resolves when done. */
  refetch: () => Promise<void>;
}

export interface MutationState<T, B> {
  /** Execute the mutation with the given body. Returns response data on success. */
  mutate: (body: B) => Promise<T>;
  /** True while the mutation is in progress. */
  isLoading: boolean;
  /** Error message if the last mutation failed, otherwise null. */
  error: string | null;
  /** Reset the error state to null. */
  reset: () => void;
}

// ---------------------------------------------------------------------------
// useQuery
// ---------------------------------------------------------------------------

/**
 * Fetch data from a path on component mount and whenever `path` or `enabled` changes.
 *
 * @param path     API path (e.g. "/appointments")
 * @param enabled  Set to false to skip fetching (useful for conditional fetches). Defaults to true.
 *
 * @example
 * const { data: appointments, isLoading, error, refetch } =
 *   useQuery<Appointment[]>("/appointments");
 */
export function useQuery<T>(path: string, enabled = true): QueryState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);

  const execute = useCallback(async (): Promise<void> => {
    if (!enabled) return;
    if (!mountedRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.get<T>(path);
      if (mountedRef.current) {
        setData(result);
      }
    } catch (err: unknown) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setData(null);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [path, enabled]);

  useEffect(() => {
    mountedRef.current = true;
    execute();

    return () => {
      mountedRef.current = false;
    };
  }, [execute]);

  return { data, isLoading, error, refetch: execute };
}

// ---------------------------------------------------------------------------
// useMutation
// ---------------------------------------------------------------------------

/**
 * Execute a mutation (POST or PATCH) via the shared API client.
 *
 * @param path    API path (e.g. "/mood")
 * @param method  HTTP method — "post" or "patch". Defaults to "post".
 *
 * @example
 * const { mutate, isLoading, error } = useMutation<MoodCheckin, MoodCheckinInput>("/mood");
 *
 * const handleSubmit = async () => {
 *   const created = await mutate({ moodScore: 7, journalText: "Good day." });
 * };
 */
export function useMutation<T, B = unknown>(
  path: string,
  method: "post" | "patch" = "post"
): MutationState<T, B> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = async (body: B): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient[method]<T, B>(path, body);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      if (mountedRef.current) {
        setError(message);
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const reset = useCallback(() => {
    if (mountedRef.current) {
      setError(null);
    }
  }, []);

  return { mutate, isLoading, error, reset };
}

// ---------------------------------------------------------------------------
// useQueryOnDemand
// ---------------------------------------------------------------------------

/**
 * Like useQuery, but does NOT fetch automatically on mount.
 * Call `fetch()` manually to trigger the request.
 *
 * Useful for search boxes, lazy-loaded sections, or user-triggered refreshes.
 *
 * @example
 * const { data, isLoading, error, fetch } =
 *   useQueryOnDemand<Therapist[]>("/therapists/match");
 *
 * // In a button handler:
 * await fetch("?specialty=anxiety");
 */
export function useQueryOnDemand<T>(
  basePath: string
): {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  fetch: (queryString?: string) => Promise<void>;
  reset: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetch = useCallback(async (queryString = ""): Promise<void> => {
    if (!mountedRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.get<T>(`${basePath}${queryString}`);
      if (mountedRef.current) {
        setData(result);
      }
    } catch (err: unknown) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setData(null);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [basePath]);

  const reset = useCallback(() => {
    if (mountedRef.current) {
      setData(null);
      setError(null);
    }
  }, []);

  return { data, isLoading, error, fetch, reset };
}
