import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./pagination";

const meta = {
  title: "Shared/Pagination",
  component: Pagination,
  parameters: { layout: "padded" },
  args: {
    page: 1,
    totalPages: 12,
    total: 116,
    limit: 10,
    onPageChange: () => undefined,
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractivePagination(args: ComponentProps<typeof Pagination>) {
  const [page, setPage] = useState(args.page);
  return <Pagination {...args} page={page} onPageChange={setPage} />;
}

export const Default: Story = {
  render: InteractivePagination,
};

export const SinglePage: Story = {
  args: {
    page: 1,
    totalPages: 1,
    total: 8,
    limit: 10,
  },
};

export const ManyPages: Story = {
  args: {
    page: 6,
    totalPages: 20,
    total: 200,
    limit: 10,
  },
};
