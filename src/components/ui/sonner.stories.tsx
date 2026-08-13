import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Toaster",
  component: Toaster,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={() => toast("Default toast")}>Default</Button>
      <Button onClick={() => toast.success("Saved successfully")}>Success</Button>
      <Button onClick={() => toast.error("Something went wrong")}>Error</Button>
      <Button onClick={() => toast.info("New update available")}>Info</Button>
      <Button onClick={() => toast.warning("Disk space is low")}>Warning</Button>
      <Toaster />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div>
      <Button
        onClick={() => {
          const id = toast.loading("Uploading…");
          setTimeout(() => toast.success("Upload complete", { id }), 3000);
        }}
      >
        Start upload
      </Button>
      <Toaster />
    </div>
  ),
};
