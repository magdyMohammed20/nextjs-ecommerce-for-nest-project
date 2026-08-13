import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle", () => {
  it("renders with a toggle label", async () => {
    await renderWithProviders(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "Toggle dark mode" })).toBeInTheDocument();
  });

  it("switches to dark after a click", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<ThemeToggle />);
    const toggle = screen.getByRole("button", { name: "Toggle dark mode" });

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    await user.click(toggle);
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });
});
