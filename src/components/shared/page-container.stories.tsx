import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageContainer } from "./page-container";

const meta = {
  title: "Shared/PageContainer",
  component: PageContainer,
} satisfies Meta<typeof PageContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Container content</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Wraps children in a centered, padded page layout.
        </p>
      </div>
    ),
  },
};
