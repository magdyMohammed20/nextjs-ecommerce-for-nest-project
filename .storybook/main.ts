import type { StorybookConfig } from "@storybook/nextjs-vite";

export default {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-themes", "msw-storybook-addon"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: [{ from: "../public", to: "public" }],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
} satisfies StorybookConfig;