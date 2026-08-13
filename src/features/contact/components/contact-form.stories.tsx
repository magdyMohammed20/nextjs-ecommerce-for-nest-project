import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContactForm } from "./contact-form";

const meta = {
  title: "Features/Contact/ContactForm",
  component: ContactForm,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
