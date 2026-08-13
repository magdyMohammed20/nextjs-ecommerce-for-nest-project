import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkeletonList } from "./skeleton-list";

const meta = {
  title: "Shared/Skeletons/SkeletonList",
  component: SkeletonList,
  parameters: { layout: "padded" },
  args: {
    count: 5,
    height: "h-14",
  },
} satisfies Meta<typeof SkeletonList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
