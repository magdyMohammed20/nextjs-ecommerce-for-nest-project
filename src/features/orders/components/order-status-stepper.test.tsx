import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { OrderStatusStepper } from "./order-status-stepper";
import type { OrderStatus } from "../types/order-types";

const FLOW: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

describe("OrderStatusStepper", () => {
  it.each(FLOW)("shows every step label for %s", async (status) => {
    await renderWithProviders(<OrderStatusStepper status={status} />);

    for (const step of FLOW) {
      expect(
        screen.getByText(new RegExp(`^${step}$`, "i")),
      ).toBeInTheDocument();
    }
    expect(
      screen.queryByText(/this order was cancelled/i),
    ).not.toBeInTheDocument();
  });

  it("shows the cancelled message instead of the flow", async () => {
    await renderWithProviders(<OrderStatusStepper status="cancelled" />);

    expect(screen.getByText("This order was cancelled.")).toBeInTheDocument();
    for (const step of FLOW) {
      expect(
        screen.queryByText(new RegExp(`^${step}$`, "i")),
      ).not.toBeInTheDocument();
    }
  });
});
