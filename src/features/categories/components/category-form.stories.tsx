import type { Meta, StoryObj } from "@storybook/react-vite";
import { CategoryForm } from "./category-form";
import { categories } from "@/test-utils/fixtures";

const meta = {
  title: "Features/Categories/CategoryForm",
  component: CategoryForm,
  parameters: { layout: "centered" },
} satisfies Meta<typeof CategoryForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Edit: Story = {
  args: { category: categories[0] },
};
