import type { Meta, StoryObj } from "@storybook/react-vite";
import { CategoryList } from "./category-list";

if (typeof document !== "undefined") {
  document.cookie =
    "auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg2NTUxNTYxLCJleHAiOjE3ODY2Mzc5NjF9.sig; path=/";
}

const meta = {
  title: "Features/Categories/CategoryList",
  component: CategoryList,
} satisfies Meta<typeof CategoryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
