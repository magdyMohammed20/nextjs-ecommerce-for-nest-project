"use client";

import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "../types/order-types";

const FLOW: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

interface OrderStatusStepperProps {
  status: OrderStatus;
}

export function OrderStatusStepper({ status }: OrderStatusStepperProps) {
  const { t } = useTranslation("orders");

  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
        <X className="h-4 w-4 shrink-0" />
        {t("stepper.cancelled")}
      </div>
    );
  }

  const currentIndex = FLOW.indexOf(status);

  return (
    <ol className="relative flex w-full items-start">
      <li
        aria-hidden
        className="absolute top-4 h-0.5 overflow-hidden rounded-full bg-muted-foreground/60"
        style={{
          left: `${100 / (2 * FLOW.length)}%`,
          right: `${100 / (2 * FLOW.length)}%`,
        }}
      >
        <div
          className="h-full bg-primary transition-[width] duration-500"
          style={{ width: `${(currentIndex / (FLOW.length - 1)) * 100}%` }}
        />
      </li>
      {FLOW.map((step, i) => {
        const reached = i <= currentIndex;
        return (
          <li
            key={step}
            className="relative flex flex-1 flex-col items-center gap-2"
          >
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background text-sm font-semibold transition-colors",
                reached
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30 text-muted-foreground",
              )}
            >
              {reached ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span
              className={cn(
                "text-center text-xs leading-tight",
                reached
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {t(`statuses.${step}`)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
