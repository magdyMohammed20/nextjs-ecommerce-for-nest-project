"use client";

import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QueryErrorState({
  title,
  description,
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  const { t } = useTranslation("common");
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-10 text-center",
        className,
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">
        {title ?? t("errors.serverErrorTitle")}
      </p>
      {description && <p className="max-w-sm text-xs text-muted-foreground">{description}</p>}
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          {t("errors.tryAgain")}
        </Button>
      )}
    </div>
  );
}
