"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  value,
  onValueChange,
  onSearch,
  placeholder,
  debounceMs = 400,
  className,
}: SearchInputProps) {
  const { t } = useTranslation("common");
  const resolvedPlaceholder = placeholder ?? t("search.placeholder");
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    const timer = setTimeout(() => onSearchRef.current(value), debounceMs);
    return () => clearTimeout(timer);
  }, [value, debounceMs]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={resolvedPlaceholder}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          type="button"
          aria-label={t("search.clear")}
          onClick={() => {
            onValueChange("");
            onSearchRef.current("");
          }}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
