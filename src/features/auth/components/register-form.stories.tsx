import type { Meta, StoryObj } from "@storybook/react-vite";
import { RegisterForm } from "./register-form";

const meta = {
  title: "Features/Auth/RegisterForm",
  component: RegisterForm,
  parameters: { layout: "centered" },
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
