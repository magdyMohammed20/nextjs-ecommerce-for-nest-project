import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { Button } from "@/components/ui/button";

describe("test harness smoke", () => {
  it("renders a button via renderWithProviders", async () => {
    await renderWithProviders(<Button variant="default">Hello</Button>);
    expect(screen.getByRole("button", { name: "Hello" })).toBeInTheDocument();
  });

  it("fires onClick and works with userEvent", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await user.click(screen.getByRole("button", { name: "Click me" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
