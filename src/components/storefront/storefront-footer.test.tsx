import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StorefrontFooter } from "./storefront-footer";

describe("StorefrontFooter", () => {
  it("renders the tagline and navigation links", () => {
    render(<StorefrontFooter />);
    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute("href", "/products");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/faq");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("renders the current year in the copyright line", () => {
    render(<StorefrontFooter />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))).toBeInTheDocument();
  });
});
