import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/preset-create-react-app",
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-queryparams",
    "msw-storybook-addon",
    {
      name: "storybook-addon-manual-mocks",
      options: {
        mocksFolder: ".storybook/.mocks/manual",
      },
    },
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  staticDirs: ["../public"],
  env: (config) => ({
    ...config,
    REACT_APP_SKIP_AUTH: "SKIP",
  }),
};
export default config;
