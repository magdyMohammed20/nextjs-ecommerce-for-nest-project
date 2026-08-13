import type { Meta, StoryObj } from "@storybook/react-vite";
import { StorefrontFooter } from "./storefront-footer";

const meta = {
  title: "Storefront/StorefrontFooter",
  component: StorefrontFooter,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StorefrontFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
