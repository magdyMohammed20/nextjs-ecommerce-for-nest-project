import type { Meta, StoryObj } from "@storybook/react-vite";
import { LanguageSwitcher } from "./language-switcher";

const meta = {
  title: "Shared/LanguageSwitcher",
  component: LanguageSwitcher,
  parameters: { layout: "centered" },
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
