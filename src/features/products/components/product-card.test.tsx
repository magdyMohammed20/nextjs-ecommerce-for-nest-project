import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { products } from "@/test-utils/fixtures";
import { ProductCard } from "./product-card";

describe("ProductCard", () => {
  it("links to the product and shows stock info for an in-stock item", async () => {
    await renderWithProviders(<ProductCard product={products[0]} />);

    const link = screen.getByRole("link", { name: /wireless headphones/i });
    expect(link).toHaveAttribute("href", "/products/1");
    expect(screen.getByText("$129.99")).toBeInTheDocument();
    expect(screen.getByText("24 in stock")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add to cart/i }),
    ).not.toBeDisabled();
  });

  it("shows an out-of-stock badge and disabled button", async () => {
    await renderWithProviders(<ProductCard product={products[1]} />);

    expect(screen.getByText("Smart Watch")).toBeInTheDocument();
    expect(screen.getAllByText("Out of stock")).toHaveLength(2);
    expect(screen.getByText("Unavailable")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /out of stock/i }),
    ).toBeDisabled();
  });
});
