import type { Meta, StoryObj } from "@storybook/react-vite";
import { StorefrontHeader } from "./storefront-header";

const meta = {
  title: "Storefront/StorefrontHeader",
  component: StorefrontHeader,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StorefrontHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
