import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "@/components/ui/form";
import { AvatarInput } from "./avatar-input";

function ControlledAvatarInput({ name, value }: { name: string; value: string }) {
  const [current, setCurrent] = useState(value);
  const form = useForm({ defaultValues: { avatar: current } });
  return (
    <Form {...form}>
      <AvatarInput name={name} value={current} onChange={setCurrent} />
    </Form>
  );
}

const meta = {
  title: "Features/Auth/AvatarInput",
  component: AvatarInput,
  parameters: { layout: "centered" },
  argTypes: {
    name: { control: "text" },
    value: { control: "text" },
  },
  args: {
    name: "Mary Johnson",
    value: "",
    onChange: () => {},
  },
} satisfies Meta<typeof AvatarInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <ControlledAvatarInput name={args.name} value={args.value} />,
};

export const WithAvatar: Story = {
  args: {
    value: "https://picsum.photos/seed/avatar/200",
    onChange: () => {},
  },
  render: (args) => <ControlledAvatarInput name={args.name} value={args.value} />,
};
