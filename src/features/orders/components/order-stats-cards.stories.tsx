import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrderStatsCards } from "./order-stats-cards";

const meta = {
  title: "Features/Orders/OrderStatsCards",
  component: OrderStatsCards,
  parameters: { layout: "padded" },
  argTypes: {
    refreshKey: { control: "number" },
  },
  args: {
    refreshKey: 0,
  },
} satisfies Meta<typeof OrderStatsCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
