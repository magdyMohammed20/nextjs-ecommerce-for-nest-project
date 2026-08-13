import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrderStatusBadge } from "./order-status-badge";
import { ORDER_STATUSES } from "../types/order-types";

const meta = {
  title: "Features/Orders/OrderStatusBadge",
  component: OrderStatusBadge,
  parameters: { layout: "centered" },
  argTypes: {
    status: {
      control: "select",
      options: ORDER_STATUSES,
    },
    iconOnly: {
      control: "boolean",
    },
  },
  args: {
    status: "shipped",
    iconOnly: false,
  },
} satisfies Meta<typeof OrderStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IconOnly: Story = {
  args: { iconOnly: true },
};

export const AllStatuses: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-3">
      {ORDER_STATUSES.map((status) => (
        <OrderStatusBadge key={status} {...args} status={status} />
      ))}
    </div>
  ),
};
