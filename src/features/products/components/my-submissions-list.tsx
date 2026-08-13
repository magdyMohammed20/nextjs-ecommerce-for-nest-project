"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackageCheck, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProductsMine } from "../hooks/use-products";
import type { ProductStatus } from "../types/product-types";
import { formatDate } from "@/features/orders/lib/format";
import { ProductStatusBadge } from "./product-status-badge";
import { Button } from "@/components/ui/button";
import { SkeletonList } from "@/components/shared/skeletons";
import { QueryErrorState } from "@/components/shared/query-states";
import { Pagination } from "@/components/shared/pagination";
import { AnimatedResults } from "@/components/shared/animated-results";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LIMIT = 8;

const STATUS_FILTERS: ProductStatus[] = ["pending", "active", "rejected"];

export function MySubmissionsList() {
  const { t } = useTranslation("products");
  const { t: tCommon } = useTranslation("common");

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("");

  const {
    data,
    isFetching,
    isError,
    refetch,
  } = useProductsMine({
    page,
    limit: LIMIT,
    status: (status as ProductStatus) || undefined,
  });
  const products = data?.data ?? [];
  const meta = data?.meta ?? {
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 0,
  };

  useEffect(() => {
    if (data && data.data.length === 0 && page > 1) {
      const raf = requestAnimationFrame(() => {
        setPage(page - 1);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [data, page]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const handleStatusChange = (next: string) => {
    if (next === status) return;
    setStatus(next);
    setPage(1);
  };

  const handleClearFilter = () => {
    setStatus("");
    setPage(1);
  };

  const hasFilter = Boolean(status);
  const needsFallback = page > 1 && data?.data.length === 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="h-9 w-full sm:w-48">
            <SelectValue placeholder={t("mine.filter.all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t("mine.filter.all")}</SelectItem>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>
                {tCommon(`statuses.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilter && (
          <Button size="sm" variant="ghost" onClick={handleClearFilter}>
            {t("mine.actions.clear")}
          </Button>
        )}
      </div>

      <AnimatedResults signature={`${status}|${page}`}>
        {isFetching || needsFallback ? (
          <SkeletonList count={LIMIT} />
        ) : isError ? (
          <QueryErrorState
            title={tCommon("toasts.somethingWentWrong")}
            onRetry={refetch}
          />
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <PackageCheck className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {hasFilter ? t("mine.emptyFiltered") : t("mine.empty")}
            </p>
            {!hasFilter && (
              <Button asChild size="sm" variant="outline" className="mt-1">
                <Link href="/products/submit">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("mine.submitProduct")}
                </Link>
              </Button>
            )}
          </div>
        ) : (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>{t("table.product")}</TableHead>
                  <TableHead>{t("table.price")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead>{t("mine.table.rejectionNote")}</TableHead>
                  <TableHead>{t("mine.table.submitted")}</TableHead>
                  <TableHead className="text-end">
                    {t("table.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/40">
                    <TableCell>
                      <Link
                        href={`/products/${product.id}`}
                        className="group flex items-center gap-3 font-medium"
                      >
                        <span className="transition-colors group-hover:text-primary">
                          {product.name}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      ${Number(product.price).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <ProductStatusBadge status={product.status} />
                    </TableCell>
                    <TableCell>
                      {product.status === "rejected" && product.rejectionNote
                        ? product.rejectionNote
                        : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(product.createdAt)}
                    </TableCell>
                    <TableCell className="text-end">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/products/${product.id}`}>
                          {t("mine.actions.view")}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            page={meta?.page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            onPageChange={handlePageChange}
          />
        </>
      )}
      </AnimatedResults>
    </div>
  );
}
