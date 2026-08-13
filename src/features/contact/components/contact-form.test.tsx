import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { http, HttpResponse } from "msw";
import { renderWithProviders } from "@/test/render";
import { server } from "@/test/setup";
import { apiUrl } from "@/test-utils/msw/handlers";
import { ContactForm } from "./contact-form";

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "New Visitor");
  await user.type(screen.getByLabelText("Email address"), "visitor@example.com");
  await user.type(screen.getByLabelText("Subject"), "Thanks");
  await user.type(
    screen.getByLabelText("Message"),
    "Just submitting a friendly note.",
  );
}

describe("ContactForm", () => {
  it("shows the success state after a valid submit", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Message sent!")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send another message/i }),
    ).toBeInTheDocument();
  });

  it("shows schema errors for invalid input", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "A");
    await user.type(screen.getByLabelText("Email address"), "not-an-email");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText("Name must be at least 2 characters"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter a valid email address"),
    ).toBeInTheDocument();
  });

  it("shows the rate-limit toast on a 429 response", async () => {
    const user = userEvent.setup();
    const error = vi.spyOn(toast, "error").mockImplementation(() => "");
    server.use(
      http.post(`${apiUrl}/contact`, () =>
        HttpResponse.json(
          { statusCode: 429, message: "Too many requests" },
          { status: 429 },
        ),
      ),
    );
    await renderWithProviders(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await vi.waitFor(() => {
      expect(error).toHaveBeenCalledWith(
        "You're sending messages too quickly. Please wait a minute and try again.",
      );
    });
    error.mockRestore();
  });
});
