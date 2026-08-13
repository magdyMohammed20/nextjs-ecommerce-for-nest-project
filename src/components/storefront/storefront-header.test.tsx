import { beforeEach, describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { getRouterMock, resetRouter } from "@/test/router";
import { StorefrontHeader } from "./storefront-header";

describe("StorefrontHeader", () => {
  beforeEach(() => {
    resetRouter();
  });

  it("shows sign in and get started links for guests", async () => {
    await renderWithProviders(<StorefrontHeader />);
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(screen.getByRole("link", { name: /get started/i })).toHaveAttribute(
      "href",
      "/register",
    );
  });

  it("submits the search query to the products page", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<StorefrontHeader />);

    const search = screen.getByPlaceholderText("Search products...");
    await user.type(search, "laptop{Enter}");

    expect(getRouterMock().push).toHaveBeenCalledWith("/products?search=laptop");
  });

  it("opens the mobile menu", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<StorefrontHeader />);

    expect(screen.getAllByRole("link", { name: "FAQ" })).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));
    await waitFor(() => {
      expect(screen.getAllByRole("link", { name: "FAQ" })).toHaveLength(2);
    });
  });
});
