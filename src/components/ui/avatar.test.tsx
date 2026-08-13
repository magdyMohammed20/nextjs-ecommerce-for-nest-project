import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

describe("Avatar", () => {
  it("shows the fallback when there is no image", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders the image element when a source is provided", async () => {
    render(
      <Avatar>
        <AvatarImage src="/uploads/jd.png" alt="Jane" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    const img = await screen.findByAltText("Jane");
    expect(img).toHaveAttribute("src", "/uploads/jd.png");
    expect(img).toHaveAttribute("data-slot", "avatar-image");
  });

  it("applies size attribute", () => {
    render(
      <Avatar size="lg">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    expect(document.querySelector('[data-slot="avatar"]')).toHaveAttribute(
      "data-size",
      "lg",
    );
  });
});
