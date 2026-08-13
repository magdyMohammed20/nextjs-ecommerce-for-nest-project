import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditUserForm } from "./user-form";
import { users } from "@/test-utils/fixtures";

if (typeof document !== "undefined") {
  document.cookie =
    "auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg2NTUxNTYxLCJleHAiOjE3ODY2Mzc5NjF9.sig; path=/";
}

const meta = {
  title: "Features/Users/UserForm",
  component: EditUserForm,
  parameters: { layout: "centered" },
  args: {
    user: users[1],
  },
} satisfies Meta<typeof EditUserForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Admin: Story = {
  args: { user: users[0] },
};
