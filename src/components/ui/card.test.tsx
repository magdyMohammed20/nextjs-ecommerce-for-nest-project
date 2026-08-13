import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe("Card", () => {
  it("renders a complete card structure", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Title")).toHaveAttribute("data-slot", "card-title");
    expect(screen.getByText("Description")).toHaveAttribute(
      "data-slot",
      "card-description",
    );
    expect(screen.getByText("Body")).toHaveAttribute("data-slot", "card-content");
    expect(screen.getByText("Footer")).toHaveAttribute("data-slot", "card-footer");
  });

  it("applies the size attribute", () => {
    render(<Card size="sm">Small</Card>);
    expect(screen.getByText("Small")).toHaveAttribute("data-size", "sm");
  });
});
