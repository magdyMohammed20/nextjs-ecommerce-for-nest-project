import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrderStatusSelect } from "./order-status-select";
import { ORDER_STATUSES } from "../types/order-types";

function ControlledStatusSelect({
  value,
  disabled,
}: ComponentProps<typeof OrderStatusSelect>) {
  const [current, setCurrent] = useState(value);
  return (
    <OrderStatusSelect
      value={current}
      onValueChange={setCurrent}
      disabled={disabled}
    />
  );
}

const meta = {
  title: "Features/Orders/OrderStatusSelect",
  component: OrderStatusSelect,
  parameters: { layout: "centered" },
  argTypes: {
    value: {
      control: "select",
      options: ORDER_STATUSES,
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    value: "pending",
    disabled: false,
    onValueChange: () => {},
  },
  render: (args) => <ControlledStatusSelect {...args} />,
} satisfies Meta<typeof OrderStatusSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};
