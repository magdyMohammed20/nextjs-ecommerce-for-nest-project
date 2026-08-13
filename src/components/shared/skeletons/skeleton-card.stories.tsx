import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkeletonCard, SkeletonGrid } from "./skeleton-card";

const meta = {
  title: "Shared/Skeletons/SkeletonCard",
  component: SkeletonCard,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SkeletonCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Grid: Story = {
  render: (args) => <SkeletonGrid {...args} count={4} />,
};
