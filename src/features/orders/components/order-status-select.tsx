"use client";

import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUSES, type OrderStatus } from "../types/order-types";

interface OrderStatusSelectProps {
  value: OrderStatus;
  onValueChange: (status: OrderStatus) => void;
  disabled?: boolean;
}

export function OrderStatusSelect({
  value,
  onValueChange,
  disabled,
}: OrderStatusSelectProps) {
  const { t } = useTranslation("orders");

  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange(next as OrderStatus)}
      disabled={disabled}
    >
      <SelectTrigger className="h-8 w-[130px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {t(`statuses.${status}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
