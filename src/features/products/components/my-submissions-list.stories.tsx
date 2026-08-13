import type { Meta, StoryObj } from "@storybook/react-vite";
import { MySubmissionsList } from "./my-submissions-list";

const meta = {
  title: "Features/Products/MySubmissionsList",
  component: MySubmissionsList,
} satisfies Meta<typeof MySubmissionsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
