import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExampleComponent } from "./example-component";

const meta = {
  title: "_Template/ExampleComponent",
  component: ExampleComponent,
} satisfies Meta<typeof ExampleComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { layout: "centered" },
};