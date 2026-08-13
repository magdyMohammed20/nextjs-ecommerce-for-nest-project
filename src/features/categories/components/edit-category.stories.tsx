import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditCategory } from "./edit-category";

const meta = {
  title: "Features/Categories/EditCategory",
  component: EditCategory,
  argTypes: {
    categoryId: { control: "number", min: 1 },
  },
  args: {
    categoryId: 1,
  },
} satisfies Meta<typeof EditCategory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
