import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppShell } from "./app-shell";

const meta = {
  title: "Shared/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Here is what happened while you were away.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Users</p>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Products</p>
            <p className="text-2xl font-bold">34</p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Orders</p>
            <p className="text-2xl font-bold">27</p>
          </div>
        </div>
      </div>
    ),
  },
};
