import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductImage } from "./product-image";
import { products } from "@/test-utils/fixtures";

const meta = {
  title: "Features/Products/ProductImage",
  component: ProductImage,
  parameters: { layout: "centered" },
  argTypes: {
    src: { control: "text" },
    alt: { control: "text" },
    className: { control: false },
  },
  args: {
    src: products[0].imageUrl,
    alt: products[0].name,
    className: "h-40 w-56 rounded-lg",
  },
} satisfies Meta<typeof ProductImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Fallback: Story = {
  args: { src: null },
};
