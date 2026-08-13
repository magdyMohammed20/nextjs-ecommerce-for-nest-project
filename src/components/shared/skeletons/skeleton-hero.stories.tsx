import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkeletonHero } from "./skeleton-hero";

const meta = {
  title: "Shared/Skeletons/SkeletonHero",
  component: SkeletonHero,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SkeletonHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
