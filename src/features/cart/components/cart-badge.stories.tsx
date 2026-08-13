import type { Meta, StoryObj } from "@storybook/react-vite";
import { CartBadge } from "./cart-badge";

const meta = {
  title: "Features/Cart/CartBadge",
  component: CartBadge,
  parameters: { layout: "centered" },
} satisfies Meta<typeof CartBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
