import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { renderWithProviders, setAuthToken, clearAuthToken } from "@/test/render";
import { NotificationBell } from "./notification-bell";

describe("NotificationBell", () => {
  beforeEach(() => {
    clearAuthToken();
  });

  it("renders nothing for non-admins", async () => {
    await renderWithProviders(<NotificationBell />);
    expect(
      screen.queryByRole("button", { name: "Notifications" }),
    ).not.toBeInTheDocument();
  });

  it("shows the unread badge and lists latest messages when opened", async () => {
    const user = userEvent.setup();
    setAuthToken("admin");
    await renderWithProviders(<NotificationBell />);

    const bell = await screen.findByRole("button", { name: "Notifications" });
    expect(await screen.findByText("1")).toBeInTheDocument();

    await user.click(bell);

    expect(await screen.findByText("Question about delivery")).toBeInTheDocument();
    expect(screen.getByText("Order status")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /view all messages/i }),
    ).toHaveAttribute("href", "/dashboard/messages");
  });

  it("marks all messages as read and clears the badge", async () => {
    const user = userEvent.setup();
    const success = vi.spyOn(toast, "success").mockImplementation(() => "");
    setAuthToken("admin");
    await renderWithProviders(<NotificationBell />);

    const bell = await screen.findByRole("button", { name: "Notifications" });
    await screen.findByText("1");
    await user.click(bell);
    await screen.findByText("Question about delivery");

    await user.click(screen.getByRole("button", { name: /mark all read/i }));

    await vi.waitFor(() => {
      expect(success).toHaveBeenCalledWith("All messages marked as read.");
    });
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Notifications" }),
      ).not.toHaveTextContent("1");
    });
    success.mockRestore();
  });
});
