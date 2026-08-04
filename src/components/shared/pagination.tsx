"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function getPageNumbers(current: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("…");
  pages.push(totalPages);

  return pages;
}

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  className,
}: PaginationProps) {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.dir() === "rtl";
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  if (totalPages <= 1) return null;

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className={cn("flex flex-col items-center justify-between gap-3 sm:flex-row", className)}>
      <p className="text-sm text-muted-foreground">
        {t("pagination.showing")}{" "}
        <span className="font-medium text-foreground">{from}</span>–
        <span className="font-medium text-foreground">{to}</span> {t("pagination.of")}{" "}
        <span className="font-medium text-foreground">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <PrevIcon className="h-4 w-4" />
          {t("pagination.previous")}
        </Button>

        <div className="flex items-center gap-1 px-1">
          {getPageNumbers(page, totalPages).map((item, index) =>
            item === "…" ? (
              <span key={`ellipsis-${index}`} className="px-1 text-sm text-muted-foreground">
                …
              </span>
            ) : (
              <Button
                key={item}
                variant={item === page ? "default" : "ghost"}
                size="icon-sm"
                className="h-8 w-8"
                onClick={() => onPageChange(item)}
              >
                {item}
              </Button>
            ),
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          {t("pagination.next")}
          <NextIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
