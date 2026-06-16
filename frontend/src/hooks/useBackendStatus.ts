import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";

const CHECK_INTERVAL = 30_000; // 30 seconds between pings
const TIMEOUT_MS = 5_000; // 5 second timeout per request

export function useBackendStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null); // null = still checking
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const check = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

      await api.get("/status", { signal: controller.signal });
      clearTimeout(timer);

      setIsOnline(true);
      setLastChecked(new Date());
    } catch {
      setIsOnline(false);
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    check(); // initial check on mount

    intervalRef.current = setInterval(check, CHECK_INTERVAL);

    // Also check when the tab becomes visible again
    const onVisibility = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [check]);

  return { isOnline, lastChecked, recheck: check };
}
