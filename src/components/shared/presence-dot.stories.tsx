import type { Meta, StoryObj } from "@storybook/react-vite";
import { PresenceDot } from "./presence-dot";

const meta = {
  title: "Shared/PresenceDot",
  component: PresenceDot,
  parameters: { layout: "centered" },
  args: {
    isOnline: true,
    lastActiveAt: new Date().toISOString(),
  },
} satisfies Meta<typeof PresenceDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Offline: Story = {
  args: {
    isOnline: false,
    lastActiveAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
};

export const StaleActivity: Story = {
  args: {
    isOnline: true,
    lastActiveAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
};
