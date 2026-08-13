import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: { layout: "centered" },
  args: {
    placeholder: "Type something…",
    type: "text",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" {...args} placeholder="you@example.com" />
    </div>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" {...args} />
      <p className="text-sm text-muted-foreground">Visible to other users.</p>
    </div>
  ),
};

export const Error: Story = {
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="email-error">Email</Label>
      <Input id="email-error" aria-invalid {...args} defaultValue="not-an-email" />
      <p className="text-sm text-destructive">Enter a valid email address.</p>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Disabled value" },
};

export const Password: Story = {
  args: { type: "password", defaultValue: "supersecret" },
};

export const File: Story = {
  args: { type: "file" },
};
