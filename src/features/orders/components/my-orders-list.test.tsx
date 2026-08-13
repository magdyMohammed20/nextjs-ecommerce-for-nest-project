import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { MyOrdersList } from "./my-orders-list";

function statCard(label: string) {
  const labelNode = screen.getByText(label);
  const card = labelNode.closest("[data-slot='card']");
  if (!card) throw new Error(`No stat card found for ${label}`);
  return within(card as HTMLElement);
}

describe("MyOrdersList", () => {
  it("renders order stats and the orders table", async () => {
    await renderWithProviders(<MyOrdersList />);

    expect(await screen.findByText("#101")).toBeInTheDocument();
    expect(screen.getByText("#102")).toBeInTheDocument();
    expect(screen.getByText("#103")).toBeInTheDocument();

    expect(screen.getByText("Shipped")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Confirmed")).toBeInTheDocument();

    expect(statCard("Total orders").getByText("4")).toBeInTheDocument();
    expect(statCard("Total spent").getByText("$645.47")).toBeInTheDocument();
    expect(statCard("In progress").getByText("2")).toBeInTheDocument();
    expect(statCard("Delivered").getByText("1")).toBeInTheDocument();
  });

  it("shows a cancel action only for cancellable orders", async () => {
    await renderWithProviders(<MyOrdersList />);
    await screen.findByText("#101");

    const pendingRow = screen.getByText("#102").closest("tr");
    expect(
      within(pendingRow!).getByRole("button", { name: "Cancel order" }),
    ).toBeInTheDocument();

    const shippedRow = screen.getByText("#101").closest("tr");
    expect(
      within(shippedRow!).queryByRole("button", { name: "Cancel order" }),
    ).not.toBeInTheDocument();
  });
});
