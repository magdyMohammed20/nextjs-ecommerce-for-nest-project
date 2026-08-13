import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkeletonStatsCard, SkeletonStatsGrid } from "./skeleton-stats-card";

const meta = {
  title: "Shared/Skeletons/SkeletonStatsCard",
  component: SkeletonStatsCard,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SkeletonStatsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Grid: Story = {
  render: (args) => <SkeletonStatsGrid {...args} count={4} />,
};
