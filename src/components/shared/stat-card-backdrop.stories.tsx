import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatCardBackdrop } from "./stat-card-backdrop";

const meta = {
  title: "Shared/StatCardBackdrop",
  component: StatCardBackdrop,
  parameters: { layout: "centered" },
} satisfies Meta<typeof StatCardBackdrop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="relative h-40 w-48 overflow-hidden rounded-xl border bg-card shadow-sm">
      <StatCardBackdrop />
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Revenue</p>
        <p className="mt-1 text-2xl font-bold">$12,840.50</p>
      </div>
    </div>
  ),
};
