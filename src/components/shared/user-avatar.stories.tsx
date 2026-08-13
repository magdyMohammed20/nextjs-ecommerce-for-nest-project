import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserAvatar } from "./user-avatar";

const meta = {
  title: "Shared/UserAvatar",
  component: UserAvatar,
  parameters: { layout: "centered" },
  args: {
    name: "Admin User",
    avatarUrl: null,
  },
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithImage: Story = {
  args: {
    avatarUrl: "https://picsum.photos/seed/avatar/200",
  },
};

export const Large: Story = {
  args: {
    className: "h-16 w-16 text-2xl",
  },
};
