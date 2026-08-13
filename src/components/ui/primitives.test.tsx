import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./input";
import { Label } from "./label";
import { Skeleton } from "./skeleton";
import { Separator } from "./separator";
import { Alert, AlertDescription, AlertTitle } from "./alert";

describe("Input", () => {
  it("renders and forwards value/props", () => {
    render(<Input placeholder="Email" value="a@b.com" readOnly />);
    const input = screen.getByPlaceholderText("Email");
    expect(input).toHaveAttribute("data-slot", "input");
    expect(input).toHaveValue("a@b.com");
  });

  it("fires onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input aria-label="Name" onChange={onChange} />);
    await user.type(screen.getByLabelText("Name"), "abc");
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText("Name")).toHaveValue("abc");
  });

  it("marks the field as invalid via aria-invalid", () => {
    render(<Input aria-label="Email" aria-invalid />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });
});

describe("Label", () => {
  it("focuses the associated input when clicked", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" />
      </>,
    );
    await user.click(screen.getByText("Email address"));
    expect(screen.getByLabelText("Email address")).toHaveFocus();
  });
});

describe("Skeleton", () => {
  it("renders a skeleton element", () => {
    render(<Skeleton className="h-10 w-full" />);
    expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
  });
});

describe("Separator", () => {
  it("renders with a data-slot and default orientation", () => {
    render(<Separator />);
    const separator = document.querySelector('[data-slot="separator"]');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
  });
});

describe("Alert", () => {
  it("renders an alert with title and description", () => {
    render(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Something happened.</AlertDescription>
      </Alert>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Something happened.")).toBeInTheDocument();
  });
});
