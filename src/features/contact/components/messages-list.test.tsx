import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { MessagesList } from "./messages-list";

describe("MessagesList", () => {
  it("loads and lists customer messages in a table", async () => {
    await renderWithProviders(<MessagesList />);

    expect(
      await screen.findByText("Question about delivery"),
    ).toBeInTheDocument();
    expect(screen.getByText("Order status")).toBeInTheDocument();
    expect(screen.getByText("Refund request")).toBeInTheDocument();

    const firstRow = screen.getByText("Question about delivery").closest("tr");
    expect(firstRow).not.toBeNull();
    expect(within(firstRow!).getByText("Ahmed Hassan")).toBeInTheDocument();
    expect(within(firstRow!).getByText("Unread")).toBeInTheDocument();
  });

  it("opens the reply dialog with the subject prefilled", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<MessagesList />);
    await screen.findByText("Question about delivery");

    const replyButtons = screen.getAllByRole("button", { name: "Reply" });
    await user.click(replyButtons[0]);

    expect(
      await screen.findByRole("dialog", {
        name: "Reply by email",
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Subject")).toHaveValue(
      "Re: Question about delivery",
    );
  });
});
