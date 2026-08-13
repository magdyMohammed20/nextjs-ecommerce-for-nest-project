import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const meta = {
  title: "UI/Label",
  component: Label,
  parameters: { layout: "centered" },
  args: {
    children: "Email address",
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInput: Story = {
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="email-field" {...args} />
      <Input id="email-field" placeholder="you@example.com" />
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
          <circle cx="8" cy="8" r="8" fill="currentColor" />
        </svg>
        Label with icon
      </>
    ),
  },
};
