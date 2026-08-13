import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrdersTable } from "./orders-table";

const meta = {
  title: "Features/Orders/OrdersTable",
  component: OrdersTable,
  parameters: { layout: "padded" },
  argTypes: {
    onStatusChange: { control: false },
  },
  args: {
    onStatusChange: () => {},
  },
} satisfies Meta<typeof OrdersTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
