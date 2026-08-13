import type { Meta, StoryObj } from "@storybook/react-vite";
import { FaqForm } from "./faq-form";
import { faqItems } from "@/test-utils/fixtures";

const meta = {
  title: "Features/Faq/FaqForm",
  component: FaqForm,
  parameters: { layout: "centered" },
} satisfies Meta<typeof FaqForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Edit: Story = {
  args: { faq: faqItems[0] },
};
