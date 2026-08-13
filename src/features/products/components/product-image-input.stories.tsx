import { useState, type ComponentProps } from "react";
import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "@/components/ui/form";
import { ProductImageInput } from "./product-image-input";
import { products } from "@/test-utils/fixtures";

function ControlledImageInput({ value }: ComponentProps<typeof ProductImageInput>) {
  const [current, setCurrent] = useState(value);
  const form = useForm({ defaultValues: { image: current } });
  return (
    <Form {...form}>
      <ProductImageInput value={current} onChange={setCurrent} />
    </Form>
  );
}

const meta = {
  title: "Features/Products/ProductImageInput",
  component: ProductImageInput,
  parameters: { layout: "padded" },
  argTypes: {
    value: { control: "text" },
  },
  args: {
    value: products[0].imageUrl ?? "",
    onChange: () => {},
  },
  render: (args) => <ControlledImageInput {...args} />,
} satisfies Meta<typeof ProductImageInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { value: "" },
};
