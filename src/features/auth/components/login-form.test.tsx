import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { renderWithProviders, clearAuthToken } from "@/test/render";
import { getRouterMock, resetRouter } from "@/test/router";
import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  beforeEach(() => {
    clearAuthToken();
    resetRouter();
  });

  it("signs an admin in and replaces the route with /dashboard", async () => {
    const user = userEvent.setup();
    const success = vi.spyOn(toast, "success").mockImplementation(() => "");
    await renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "admin@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await vi.waitFor(() => {
      expect(getRouterMock().replace).toHaveBeenCalledWith("/dashboard");
    });
    expect(success).toHaveBeenCalledWith(
      expect.stringContaining("Welcome back"),
    );
    success.mockRestore();
  });

  it("shows schema errors for an invalid email", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText("Enter a valid email address"),
    ).toBeInTheDocument();
  });

  it("shows an error when required fields are missing", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });
});
