"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { ErrorPage } from "@/components/shared/error-page";
import { Button } from "@/components/ui/button";
import i18n from "@/lib/i18n";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = (key: string, opts?: Record<string, unknown>) =>
    i18n.t(key, { ns: "common", ...opts });

  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <ErrorPage
      status={t("errors.serverErrorStatus")}
      icon={TriangleAlert}
      title={t("errors.serverErrorTitle")}
      description={t("errors.serverErrorDescription")}
      badgeClassName="bg-destructive/10 text-destructive"
      actions={
        <>
          <Button onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("errors.tryAgain")}
          </Button>
          <Button asChild variant="outline">
            <Link href="/">{t("errors.backHome")}</Link>
          </Button>
        </>
      }
    >
      {error.digest ? (
        <p className="mt-4 text-xs tabular-nums text-muted-foreground">
          {t("errors.digest", { digest: error.digest })}
        </p>
      ) : undefined}
    </ErrorPage>
  );
}
