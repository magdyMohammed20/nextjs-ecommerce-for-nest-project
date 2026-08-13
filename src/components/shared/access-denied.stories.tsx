import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccessDenied } from "./access-denied";

const meta = {
  title: "Shared/AccessDenied",
  component: AccessDenied,
  parameters: { layout: "centered" },
} satisfies Meta<typeof AccessDenied>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
