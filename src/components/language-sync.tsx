"use client";

import { useEffect } from "react";
import { getInitialLanguage, setAppLanguage } from "@/lib/i18n";

export function LanguageSync() {
  useEffect(() => {
    void setAppLanguage(getInitialLanguage());
  }, []);

  return null;
}
