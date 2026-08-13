import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductStatusBadge } from "./product-status-badge";
import type { ProductStatus } from "../types/product-types";

const productStatuses: ProductStatus[] = ["pending", "active", "rejected"];

const meta = {
  title: "Features/Products/ProductStatusBadge",
  component: ProductStatusBadge,
  parameters: { layout: "centered" },
  argTypes: {
    status: {
      control: "select",
      options: productStatuses,
    },
    iconOnly: {
      control: "boolean",
    },
  },
  args: {
    status: "active",
    iconOnly: false,
  },
} satisfies Meta<typeof ProductStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IconOnly: Story = {
  args: { iconOnly: true },
};

export const AllStatuses: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-3">
      {productStatuses.map((status) => (
        <ProductStatusBadge key={status} {...args} status={status} />
      ))}
    </div>
  ),
};
