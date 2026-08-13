import type { Meta, StoryObj } from "@storybook/react-vite";
import { MyOrdersList } from "./my-orders-list";

const meta = {
  title: "Features/Orders/MyOrdersList",
  component: MyOrdersList,
  parameters: { layout: "padded" },
} satisfies Meta<typeof MyOrdersList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
