import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("renders as a button with default variant data", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveAttribute("data-variant", "default");
    expect(button).toHaveAttribute("data-size", "default");
  });

  it("applies variant and size attributes", () => {
    render(<Button variant="destructive" size="sm">Delete</Button>);
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toHaveAttribute("data-variant", "destructive");
    expect(button).toHaveAttribute("data-size", "sm");
  });

  it("calls onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders a child element via asChild", () => {
    render(
      <Button asChild>
        <a href="https://example.com/products">Browse</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Browse" });
    expect(link).toHaveAttribute("href", "https://example.com/products");
    expect(link).toHaveAttribute("data-slot", "button");
  });
});
