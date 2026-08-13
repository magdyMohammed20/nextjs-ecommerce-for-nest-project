import type { Meta, StoryObj } from "@storybook/react-vite";
import { Logo } from "./logo";

const meta = {
  title: "Shared/Logo",
  component: Logo,
  parameters: { layout: "centered" },
  args: {
    showText: true,
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IconOnly: Story = {
  args: { showText: false },
};

export const OnDark: Story = {
  args: { className: "text-foreground" },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
