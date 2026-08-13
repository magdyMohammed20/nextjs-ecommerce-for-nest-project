import type { Meta, StoryObj } from "@storybook/react-vite";
import { FaqList } from "./faq-list";

const faqItems = [
  {
    question: "How fast is delivery?",
    answer:
      "Orders ship within 24 hours and arrive in 2–5 business days.",
  },
  {
    question: "Can I return a product?",
    answer: "Yes, returns are accepted within 30 days of delivery.",
  },
  {
    question: "Do you offer gift wrapping?",
    answer: "Gift wrapping is available at checkout for $2 per item.",
  },
];

const meta = {
  title: "Features/Faq/FaqList",
  component: FaqList,
  parameters: { layout: "centered" },
  args: {
    items: faqItems,
  },
} satisfies Meta<typeof FaqList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
