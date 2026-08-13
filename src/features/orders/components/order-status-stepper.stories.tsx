import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrderStatusStepper } from "./order-status-stepper";
import { ORDER_STATUSES } from "../types/order-types";

const meta = {
  title: "Features/Orders/OrderStatusStepper",
  component: OrderStatusStepper,
  parameters: { layout: "centered" },
  argTypes: {
    status: {
      control: "select",
      options: ORDER_STATUSES,
    },
  },
  args: {
    status: "shipped",
  },
} satisfies Meta<typeof OrderStatusStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Cancelled: Story = {
  args: { status: "cancelled" },
};

export const AllStatuses: Story = {
  render: (args) => (
    <div className="w-[560px] space-y-6">
      {ORDER_STATUSES.map((status) => (
        <div key={status}>
          <OrderStatusStepper {...args} status={status} />
        </div>
      ))}
    </div>
  ),
};
