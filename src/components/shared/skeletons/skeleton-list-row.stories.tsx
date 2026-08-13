import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkeletonListRow } from "./skeleton-list-row";

const meta = {
  title: "Shared/Skeletons/SkeletonListRow",
  component: SkeletonListRow,
  parameters: { layout: "centered" },
  args: {
    height: "h-14",
  },
} satisfies Meta<typeof SkeletonListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
