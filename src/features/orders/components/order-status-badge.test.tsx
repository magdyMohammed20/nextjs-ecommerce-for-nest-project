import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { OrderStatusBadge } from "./order-status-badge";
import type { OrderStatus } from "../types/order-types";

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

describe("OrderStatusBadge", () => {
  it.each(statuses)("renders the label for %s", async (status) => {
    await renderWithProviders(<OrderStatusBadge status={status} />);
    expect(screen.getByText(new RegExp(`^${status}$`, "i"))).toBeInTheDocument();
  });

  it("renders an icon-only badge with a tooltip label", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<OrderStatusBadge status="shipped" iconOnly />);

    const trigger = document.querySelector(
      '[data-slot="tooltip-trigger"]',
    ) as HTMLElement;
    expect(screen.queryByText(/shipped/i)).not.toBeInTheDocument();

    await user.hover(trigger);
    expect(await screen.findByText(/shipped/i)).toBeInTheDocument();
  });
});
