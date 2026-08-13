import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditFaq } from "./edit-faq";

const meta = {
  title: "Features/Faq/EditFaq",
  component: EditFaq,
  argTypes: {
    faqId: { control: "number", min: 1 },
  },
  args: {
    faqId: 1,
  },
} satisfies Meta<typeof EditFaq>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
