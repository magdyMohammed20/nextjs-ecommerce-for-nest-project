"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import { ErrorPage } from "@/components/shared/error-page";
import { Button } from "@/components/ui/button";
import i18n from "@/lib/i18n";

export default function NotFound() {
  const t = (key: string) => i18n.t(key, { ns: "common" });

  return (
    <ErrorPage
      status={t("errors.notFoundStatus")}
      icon={SearchX}
      title={t("errors.notFoundTitle")}
      description={t("errors.notFoundDescription")}
      badgeClassName="bg-primary/10 text-primary"
      actions={
        <Button asChild>
          <Link href="/">{t("errors.backHome")}</Link>
        </Button>
      }
    />
  );
}
