import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductList } from "./product-list";

const meta = {
  title: "Features/Products/ProductList",
  component: ProductList,
  parameters: { layout: "padded" },
  argTypes: {
    initialSearch: { control: "text" },
    initialCategoryIds: { control: false },
  },
  args: {
    initialSearch: "",
  },
} satisfies Meta<typeof ProductList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
