import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditUser } from "./edit-user";

const meta = {
  title: "Features/Users/EditUser",
  component: EditUser,
  argTypes: {
    userId: { control: "number", min: 1 },
  },
  args: {
    userId: 2,
  },
} satisfies Meta<typeof EditUser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
