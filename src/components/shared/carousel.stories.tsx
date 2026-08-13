import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel } from "./carousel";

const slides = [
  "Wireless Headphones",
  "Smart Watch",
  "Cotton T-Shirt",
  "Ceramic Coffee Mug",
  "Yoga Mat",
  "Bluetooth Speaker",
];

const meta = {
  title: "Shared/Carousel",
  component: Carousel,
  parameters: { layout: "padded" },
  args: {
    children: <div />,
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

function CarouselDemo() {
  return (
    <Carousel>
      {slides.map((title) => (
        <Card key={title} className="w-72 shrink-0 snap-start">
          <CardContent className="flex h-40 items-center justify-center">
            <p className="font-medium">{title}</p>
          </CardContent>
        </Card>
      ))}
    </Carousel>
  );
}

export const Default: Story = {
  render: CarouselDemo,
};
