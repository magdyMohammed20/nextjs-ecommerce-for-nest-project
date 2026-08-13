import type { Meta, StoryObj } from "@storybook/react-vite";
import { SiteNavbar } from "./site-navbar";

const meta = {
  title: "Shared/SiteNavbar",
  component: SiteNavbar,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SiteNavbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
