import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdminSubmissionsList } from "./admin-submissions-list";

const meta = {
  title: "Features/Products/AdminSubmissionsList",
  component: AdminSubmissionsList,
} satisfies Meta<typeof AdminSubmissionsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
