"use client";

import { useQuery } from "@tanstack/react-query";
import { statsApi } from "../api/stats-api";
import { dashboardQueryKeys } from "../api/queryKeys";

export function useStats(refetchInterval: number | false = false) {
  return useQuery({
    queryKey: dashboardQueryKeys.stats,
    queryFn: statsApi.getStats,
    refetchInterval: refetchInterval || undefined,
  });
}
