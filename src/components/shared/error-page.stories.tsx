import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { ErrorPage } from "./error-page";

const meta = {
  title: "Shared/ErrorPage",
  component: ErrorPage,
  parameters: { layout: "fullscreen" },
  args: {
    status: "404",
    icon: TriangleAlert,
    title: "Page not found",
    description: "The page you are looking for doesn't exist or has been moved.",
  },
} satisfies Meta<typeof ErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ErrorPage
      {...args}
      actions={
        <>
          <Button asChild variant="outline">
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Contact support</Link>
          </Button>
        </>
      }
    />
  ),
};

export const ServerError: Story = {
  args: {
    status: "500",
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again later.",
  },
};

export const AccessDenied: Story = {
  args: {
    status: "403",
    title: "Access denied",
    description: "You don't have permission to view this page.",
  },
};
