import useSWR, { type SWRConfiguration } from "swr";
import api from "@/lib/api";

const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 30000,
  errorRetryCount: 2,
};

const fetcher = (url: string) => api.get(url).then((res) => res.data);

/**
 * Generic SWR-based data fetching hook for the ThreeDevs API.
 * Pass any API path (e.g. "/portfolios", "/admin/orders") and get
 * back `{ data, error, isLoading, mutate }`.
 */
export function useApi<T = any>(
  path: string | null,
  config?: SWRConfiguration
) {
  const { data, error, isLoading, mutate } = useSWR<T>(
    path,
    fetcher,
    { ...defaultConfig, ...config }
  );

  return { data, error, isLoading, mutate };
}

export default useApi;
