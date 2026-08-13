"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { faqApi } from "../api/faq-api";
import { faqQueryKeys } from "../api/queryKeys";
import type { CreateFaqPayload, UpdateFaqPayload } from "../types/faq-types";

export function useActiveFaqs() {
  return useQuery({
    queryKey: faqQueryKeys.active,
    queryFn: faqApi.getActive,
  });
}

export function useManageFaqs() {
  return useQuery({
    queryKey: faqQueryKeys.manage,
    queryFn: faqApi.getManage,
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFaqPayload) => faqApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqQueryKeys.all });
    },
  });
}

export function useUpdateFaq(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateFaqPayload) => faqApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqQueryKeys.all });
    },
  });
}

export function useRemoveFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => faqApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqQueryKeys.all });
    },
  });
}
