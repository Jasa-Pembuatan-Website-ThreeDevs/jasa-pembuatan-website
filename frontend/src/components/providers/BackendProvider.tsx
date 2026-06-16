"use client";

import { useEffect } from "react";
import { useBackendStatus } from "@/hooks/useBackendStatus";
import { usePathname } from "next/navigation";

/**
 * BackendProvider — client-side wrapper that monitors backend connectivity.
 *
 * - On initial load, pings GET /api/status
 * - If offline, redirects to /maintenance (unless already there)
 * - If on /maintenance and backend recovers, auto-redirects back
 * - Renders children normally when online
 */
export default function BackendProvider({ children }: { children: React.ReactNode }) {
  const { isOnline } = useBackendStatus();
  const pathname = usePathname();

  const isOnMaintenance = pathname === "/maintenance";

  useEffect(() => {
    // Don't redirect during initial loading state (isOnline === null)
    if (isOnline === null) return;

    if (!isOnline && !isOnMaintenance) {
      // Backend is down and we're not on the maintenance page → redirect
      window.location.href = "/maintenance";
    }

    if (isOnline && isOnMaintenance) {
      // Backend recovered while on maintenance page → go home
      window.location.href = "/";
    }
  }, [isOnline, isOnMaintenance]);

  // While the initial check is in progress, show children normally
  // to avoid a flash of blank content on fast connections
  return <>{children}</>;
}
