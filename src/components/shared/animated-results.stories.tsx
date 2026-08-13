import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { AnimatedResults } from "./animated-results";

const meta = {
  title: "Shared/AnimatedResults",
  component: AnimatedResults,
  parameters: { layout: "centered" },
  args: {
    signature: "page-1",
    children: <div />,
  },
} satisfies Meta<typeof AnimatedResults>;

export default meta;
type Story = StoryObj<typeof meta>;

function AnimatedResultsDemo() {
  const [page, setPage] = useState(1);
  return (
    <div className="flex flex-col items-center gap-4">
      <AnimatedResults signature={`page-${page}`}>
        <div className="flex w-64 flex-col items-center rounded-xl border bg-card p-4 shadow-sm">
          <span className="text-sm text-muted-foreground">Page</span>
          <span className="text-3xl font-bold">{page}</span>
        </div>
      </AnimatedResults>
      <div className="flex gap-2">
        <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </Button>
        <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: AnimatedResultsDemo,
};
