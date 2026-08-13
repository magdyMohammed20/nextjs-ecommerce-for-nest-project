import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { SearchDropdownPanel } from "./search-dropdown";

const meta = {
  title: "Shared/SearchDropdownPanel",
  component: SearchDropdownPanel,
  parameters: { layout: "padded" },
  args: {
    open: false,
    onClose: () => undefined,
  },
} satisfies Meta<typeof SearchDropdownPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveSearchDropdown(args: ComponentProps<typeof SearchDropdownPanel>) {
  const [open, setOpen] = useState(args.open);
  return (
    <div className="w-full">
      <Button onClick={() => setOpen((o) => !o)}>
        {open ? "Close search" : "Open search"}
      </Button>
      <SearchDropdownPanel {...args} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export const Default: Story = {
  render: InteractiveSearchDropdown,
};

export const Open: Story = {
  args: { open: true },
};
