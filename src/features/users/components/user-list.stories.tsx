import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserList } from "./user-list";

if (typeof document !== "undefined") {
  document.cookie =
    "auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg2NTUxNTYxLCJleHAiOjE3ODY2Mzc5NjF9.sig; path=/";
}

const meta = {
  title: "Features/Users/UserList",
  component: UserList,
} satisfies Meta<typeof UserList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
