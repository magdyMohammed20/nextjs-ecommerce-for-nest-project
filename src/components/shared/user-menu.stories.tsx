import type { Meta, StoryObj } from "@storybook/react-vite";
import { RoleBadge, UserMenu } from "./user-menu";

const meta = {
  title: "Shared/UserMenu",
  component: UserMenu,
  parameters: { layout: "centered" },
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RoleBadgeStory: Story = {
  render: () => <RoleBadge />,
};
