import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddToCartButton } from "./add-to-cart-button";
import { products } from "@/test-utils/fixtures";

const meta = {
  title: "Features/Cart/AddToCartButton",
  component: AddToCartButton,
  parameters: { layout: "centered" },
  argTypes: {
    productId: { control: "number" },
    outOfStock: { control: "boolean" },
    showQuantity: { control: "boolean" },
  },
  args: {
    productId: 1,
    outOfStock: false,
    showQuantity: false,
    product: products[0],
  },
} satisfies Meta<typeof AddToCartButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithQuantity: Story = {
  args: { showQuantity: true },
};

export const OutOfStock: Story = {
  args: { outOfStock: true },
};
