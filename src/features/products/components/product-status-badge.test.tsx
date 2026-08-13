import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { ProductStatusBadge } from "./product-status-badge";
import type { ProductStatus } from "../types/product-types";

const statuses: ProductStatus[] = ["pending", "active", "rejected"];

describe("ProductStatusBadge", () => {
  it.each(statuses)("renders the label for %s", async (status) => {
    await renderWithProviders(<ProductStatusBadge status={status} />);
    expect(screen.getByText(new RegExp(`^${status}$`, "i"))).toBeInTheDocument();
  });

  it("renders an icon-only badge with a tooltip label", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<ProductStatusBadge status="active" iconOnly />);

    const trigger = document.querySelector(
      '[data-slot="tooltip-trigger"]',
    ) as HTMLElement;
    expect(screen.queryByText(/active/i)).not.toBeInTheDocument();

    await user.hover(trigger);
    expect(await screen.findByText(/active/i)).toBeInTheDocument();
  });
});
