"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { setAppLanguage, type AppLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current: AppLanguage = i18n.resolvedLanguage?.startsWith("ar") ? "ar" : "en";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
          aria-label="Switch language"
        >
          <Languages className="h-4 w-4" />
          <span className="text-xs font-semibold">{current === "ar" ? "العربية" : "EN"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          className={cn("cursor-pointer", current === "en" && "font-semibold text-primary")}
          onClick={() => void setAppLanguage("en")}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn("cursor-pointer", current === "ar" && "font-semibold text-primary")}
          onClick={() => void setAppLanguage("ar")}
        >
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
