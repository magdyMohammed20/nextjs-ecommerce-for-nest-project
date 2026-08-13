import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { OrderStatsCards } from "./order-stats-cards";

function statCard(label: string) {
  const labelNode = screen.getByText(label);
  const card = labelNode.closest("[data-slot='card']");
  if (!card) throw new Error(`No stat card found for ${label}`);
  return within(card as HTMLElement);
}

describe("OrderStatsCards", () => {
  it("renders all admin order stats", async () => {
    await renderWithProviders(<OrderStatsCards />);

    expect(await screen.findByText("Total orders")).toBeInTheDocument();
    expect(statCard("Total orders").getByText("3")).toBeInTheDocument();
    expect(statCard("Revenue").getByText("$601.48")).toBeInTheDocument();
    expect(statCard("Pending").getByText("1")).toBeInTheDocument();
    expect(statCard("Confirmed").getByText("1")).toBeInTheDocument();
    expect(statCard("Shipped").getByText("1")).toBeInTheDocument();
    expect(statCard("Delivered").getByText("0")).toBeInTheDocument();
    expect(statCard("Cancelled").getByText("0")).toBeInTheDocument();
  });
});
