import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

function TestForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}

describe("Form", () => {
  it("shows a validation error on invalid submit and marks input invalid", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    await user.type(screen.getByPlaceholderText("Email"), "not-an-email");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("Enter a valid email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("clears the error after a valid submit", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByText("Enter a valid email address")).toBeInTheDocument();

    await user.clear(screen.getByPlaceholderText("Email"));
    await user.type(screen.getByPlaceholderText("Email"), "a@b.com");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.queryByText("Enter a valid email address")).not.toBeInTheDocument();
  });
});
