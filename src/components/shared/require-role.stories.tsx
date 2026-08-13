import type { Meta, StoryObj } from "@storybook/react-vite";
import { RequireRole } from "./require-role";

const meta = {
  title: "Shared/RequireRole",
  component: RequireRole,
  parameters: { layout: "centered" },
  argTypes: {
    role: {
      control: "select",
      options: ["admin", "user"],
    },
  },
  args: {
    role: "admin",
    children: (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Protected content</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Only users with the matching role can see this.
        </p>
      </div>
    ),
  },
} satisfies Meta<typeof RequireRole>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AdminAccess: Story = {
  args: { role: "admin" },
};

export const UserAccess: Story = {
  args: { role: "user" },
};
