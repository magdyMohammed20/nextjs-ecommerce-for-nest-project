import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditProfileForm } from "./edit-profile-form";
import { adminUser } from "@/test-utils/fixtures";

const meta = {
  title: "Features/Auth/EditProfileForm",
  component: EditProfileForm,
  parameters: { layout: "centered" },
  args: {
    user: adminUser,
    onProfileUpdated: () => {},
  },
} satisfies Meta<typeof EditProfileForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
