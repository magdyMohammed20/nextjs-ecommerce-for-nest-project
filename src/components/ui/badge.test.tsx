import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders with the default variant", () => {
    render(<Badge>New</Badge>);
    const badge = screen.getByText("New");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).toHaveAttribute("data-variant", "default");
  });

  it("applies a custom variant", () => {
    render(<Badge variant="destructive">Error</Badge>);
    expect(screen.getByText("Error")).toHaveAttribute("data-variant", "destructive");
  });

  it("renders a child element via asChild", () => {
    render(
      <Badge asChild>
        <a href="/tag">Sale</a>
      </Badge>,
    );
    const link = screen.getByRole("link", { name: "Sale" });
    expect(link).toHaveAttribute("data-slot", "badge");
  });
});
