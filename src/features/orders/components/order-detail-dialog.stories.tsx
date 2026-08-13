import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrderDetailDialog } from "./order-detail-dialog";
import { orders } from "@/test-utils/fixtures";

const meta = {
  title: "Features/Orders/OrderDetailDialog",
  component: OrderDetailDialog,
  parameters: { layout: "centered" },
  argTypes: {
    open: { control: "boolean" },
    isLoading: { control: "boolean" },
  },
  args: {
    order: orders[0],
    open: true,
    isLoading: false,
    onOpenChange: () => {},
  },
} satisfies Meta<typeof OrderDetailDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { order: null, isLoading: true },
};
