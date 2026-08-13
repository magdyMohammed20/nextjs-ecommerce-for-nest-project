import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckoutPage } from "./checkout-page";

const meta = {
  title: "Features/Cart/CheckoutPage",
  component: CheckoutPage,
  parameters: { layout: "padded" },
} satisfies Meta<typeof CheckoutPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
