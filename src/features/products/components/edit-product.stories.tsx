import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditProduct } from "./edit-product";

const meta = {
  title: "Features/Products/EditProduct",
  component: EditProduct,
  parameters: { layout: "padded" },
  argTypes: {
    productId: {
      control: "number",
    },
  },
  args: {
    productId: 1,
  },
} satisfies Meta<typeof EditProduct>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
