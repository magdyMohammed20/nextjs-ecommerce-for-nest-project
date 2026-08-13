import type { Meta, StoryObj } from "@storybook/react-vite";
import { MobileNav } from "./mobile-nav";

const meta = {
  title: "Shared/MobileNav",
  component: MobileNav,
  parameters: { layout: "centered" },
} satisfies Meta<typeof MobileNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
