import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PriceRangeSlider } from "./price-range-slider";

function ControlledSlider({
  min,
  max,
  value,
  className,
}: ComponentProps<typeof PriceRangeSlider>) {
  const [current, setCurrent] = useState<[number, number]>(value);
  return (
    <PriceRangeSlider
      min={min}
      max={max}
      value={current}
      onChange={setCurrent}
      className={className}
    />
  );
}

const meta = {
  title: "Features/Products/PriceRangeSlider",
  component: PriceRangeSlider,
  parameters: { layout: "centered" },
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    value: { control: false },
    onChange: { control: false },
  },
  args: {
    min: 0,
    max: 500,
    value: [50, 250],
    onChange: () => {},
  },
  render: (args) => <ControlledSlider {...args} />,
} satisfies Meta<typeof PriceRangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
