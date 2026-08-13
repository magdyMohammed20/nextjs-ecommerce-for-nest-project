import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "./logo";

describe("Logo", () => {
  it("renders the app name by default", () => {
    render(<Logo />);
    expect(screen.getByText("ShopWave")).toBeInTheDocument();
  });

  it("hides the text when showText is false", () => {
    render(<Logo showText={false} />);
    expect(screen.queryByText("ShopWave")).not.toBeInTheDocument();
  });
});
