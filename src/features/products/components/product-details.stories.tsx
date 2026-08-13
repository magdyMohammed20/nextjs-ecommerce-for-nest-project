import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductDetails } from "./product-details";

const meta = {
  title: "Features/Products/ProductDetails",
  component: ProductDetails,
  parameters: { layout: "padded" },
  argTypes: {
    productId: { control: "number" },
  },
  args: {
    productId: 1,
  },
} satisfies Meta<typeof ProductDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
