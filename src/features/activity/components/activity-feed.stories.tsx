import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActivityFeed } from "./activity-feed";
import { activityEntries } from "@/test-utils/fixtures";

const meta = {
  title: "Features/Activity/ActivityFeed",
  component: ActivityFeed,
  parameters: { layout: "padded" },
  argTypes: {
    isLoading: { control: "boolean" },
    hasError: { control: "boolean" },
    items: { control: false },
  },
  args: {
    items: activityEntries,
    isLoading: false,
    hasError: false,
  },
} satisfies Meta<typeof ActivityFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { items: [], isLoading: true },
};

export const Error: Story = {
  args: { items: [], hasError: true },
};

export const Empty: Story = {
  args: { items: [] },
};
