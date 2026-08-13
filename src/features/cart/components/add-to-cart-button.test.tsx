import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { renderWithProviders, setAuthToken, clearAuthToken } from "@/test/render";
import { clearGuestCart, getGuestCartSnapshot } from "@/features/cart/lib/guest-cart";
import { products } from "@/test-utils/fixtures";
import { AddToCartButton } from "./add-to-cart-button";

describe("AddToCartButton", () => {
  beforeEach(() => {
    clearAuthToken();
    clearGuestCart();
    window.localStorage.removeItem("nest_auth_guest_cart");
  });

  it("renders nothing for admins", async () => {
    setAuthToken("admin");
    await renderWithProviders(<AddToCartButton productId={1} />);
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /add to cart/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("adds the product to the guest cart and shows a toast", async () => {
    const user = userEvent.setup();
    const success = vi.spyOn(toast, "success").mockImplementation(() => "");
    await renderWithProviders(<AddToCartButton productId={1} product={products[0]} />);

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    await vi.waitFor(() => {
      expect(getGuestCartSnapshot()).toEqual([
        expect.objectContaining({ productId: 1, quantity: 1 }),
      ]);
    });
    expect(success).toHaveBeenCalledWith("Added 1 to your cart");
    success.mockRestore();
  });

  it("disables the button when out of stock", async () => {
    await renderWithProviders(<AddToCartButton productId={1} outOfStock />);
    expect(
      screen.getByRole("button", { name: /out of stock/i }),
    ).toBeDisabled();
  });

  it("increments the quantity with the stepper", async () => {
    const user = userEvent.setup();
    await renderWithProviders(
      <AddToCartButton productId={1} product={products[0]} showQuantity />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Increase quantity" }));
    expect(screen.queryByText("1")).not.toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Decrease quantity" }));
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
