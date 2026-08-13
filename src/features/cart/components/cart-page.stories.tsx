import type { Meta, StoryObj } from "@storybook/react-vite";
import { CartPage } from "./cart-page";

const meta = {
  title: "Features/Cart/CartPage",
  component: CartPage,
  parameters: { layout: "padded" },
} satisfies Meta<typeof CartPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
