import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heartbeat } from "./heartbeat";

const meta = {
  title: "Shared/Heartbeat",
  component: Heartbeat,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Heartbeat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
