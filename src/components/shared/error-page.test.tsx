import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorPage } from "./error-page";
import { AccessDenied } from "./access-denied";

describe("ErrorPage", () => {
  it("renders status, title, description, and actions", () => {
    render(
      <ErrorPage
        status="404"
        icon={AlertTriangle}
        title="Page not found"
        description="The page you are looking for does not exist."
        actions={
          <Button onClick={() => {}}>
            Go home
          </Button>
        }
      />,
    );
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(
      screen.getByText("The page you are looking for does not exist."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go home" })).toBeInTheDocument();
  });
});

describe("AccessDenied", () => {
  it("renders the translated title and description", () => {
    render(<AccessDenied />);
    expect(
      screen.getByRole("heading", { name: /no access|access denied/i }),
    ).toBeInTheDocument();
  });
});
