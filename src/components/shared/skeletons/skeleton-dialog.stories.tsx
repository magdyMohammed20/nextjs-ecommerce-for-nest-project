import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkeletonDialog } from "./skeleton-dialog";

const meta = {
  title: "Shared/Skeletons/SkeletonDialog",
  component: SkeletonDialog,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SkeletonDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
