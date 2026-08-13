import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductCard } from "./product-card";
import { products } from "@/test-utils/fixtures";

const meta = {
  title: "Features/Products/ProductCard",
  component: ProductCard,
  parameters: { layout: "centered" },
  args: {
    product: products[0],
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OutOfStock: Story = {
  args: { product: products[1] },
};
