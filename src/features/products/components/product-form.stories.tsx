import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductForm } from "./product-form";
import { products } from "@/test-utils/fixtures";

const meta = {
  title: "Features/Products/ProductForm",
  component: ProductForm,
  parameters: { layout: "padded" },
  argTypes: {
    mode: {
      control: "select",
      options: ["create", "edit", "submit"],
    },
  },
  args: {
    mode: "create",
  },
} satisfies Meta<typeof ProductForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {};

export const Edit: Story = {
  args: { mode: "edit", product: products[0] },
};

export const Submit: Story = {
  args: { mode: "submit" },
};
