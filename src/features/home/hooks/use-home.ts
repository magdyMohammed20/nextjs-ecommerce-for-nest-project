"use client";

import { useQuery } from "@tanstack/react-query";
import { homeApi } from "../api/home-api";
import { homeQueryKeys } from "../api/queryKeys";

export function useHome() {
  return useQuery({
    queryKey: homeQueryKeys.all,
    queryFn: homeApi.getHome,
    // Landing falls back to static i18n content when the API is unreachable.
    retry: false,
  });
}
