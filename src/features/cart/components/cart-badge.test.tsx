import { beforeEach, describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders, setAuthToken, clearAuthToken } from "@/test/render";
import { addToGuestCart, clearGuestCart } from "@/features/cart/lib/guest-cart";
import { products } from "@/test-utils/fixtures";
import { CartBadge } from "./cart-badge";

describe("CartBadge", () => {
  beforeEach(() => {
    clearAuthToken();
    clearGuestCart();
    window.localStorage.removeItem("nest_auth_guest_cart");
  });

  it("renders nothing for admins", async () => {
    setAuthToken("admin");
    await renderWithProviders(<CartBadge />);
    await waitFor(() => {
      expect(screen.queryByRole("link", { name: "Cart" })).not.toBeInTheDocument();
    });
  });

  it("links to /cart and shows the item count for guests", async () => {
    addToGuestCart(1, 2, products[0]);
    addToGuestCart(3, 1, products[2]);

    await renderWithProviders(<CartBadge />);

    const link = screen.getByRole("link", { name: "Cart" });
    expect(link).toHaveAttribute("href", "/cart");
    expect(link).toHaveTextContent("3");
  });

  it("renders no count badge when the cart is empty", async () => {
    await renderWithProviders(<CartBadge />);
    expect(screen.getByRole("link", { name: "Cart" })).not.toHaveTextContent("0");
  });

  it("caps the count badge at 99+", async () => {
    addToGuestCart(1, 100, products[0]);
    await renderWithProviders(<CartBadge />);
    expect(screen.getByRole("link", { name: "Cart" })).toHaveTextContent("99+");
  });
});
