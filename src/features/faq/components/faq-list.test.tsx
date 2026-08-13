import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { FaqList } from "./faq-list";

const items = [
  { question: "How fast is delivery?", answer: "Within 3 business days." },
  { question: "Can I return a product?", answer: "Yes, within 30 days." },
];

describe("FaqList", () => {
  it("renders nothing when there are no items", async () => {
    await renderWithProviders(<FaqList items={[]} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows the first answer by default", async () => {
    await renderWithProviders(<FaqList items={items} />);

    expect(screen.getByText("How fast is delivery?")).toBeInTheDocument();
    expect(screen.getByText("Within 3 business days.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "How fast is delivery?" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: "Can I return a product?" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles answers when buttons are clicked", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<FaqList items={items} />);

    const second = screen.getByRole("button", {
      name: "Can I return a product?",
    });
    await user.click(second);

    expect(
      await screen.findByText("Yes, within 30 days."),
    ).toBeInTheDocument();
    expect(second).toHaveAttribute("aria-expanded", "true");

    await user.click(second);
    expect(second).toHaveAttribute("aria-expanded", "false");
  });
});
