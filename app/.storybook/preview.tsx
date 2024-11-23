import React from "react";
import type { Preview } from "@storybook/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { initialize, mswLoader, mswDecorator } from "msw-storybook-addon";
import * as mswHandlers from "./.mocks";

initialize({});

const mockedQueryClient = new QueryClient();

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: {
      handlers: mswHandlers,
    },
  },
  decorators: [
    (Story, { parameters }) => {
      const { layout } = parameters;
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <Story />
          {layout === "fullscreen" && <ReactQueryDevtools />}
        </QueryClientProvider>
      );
    },
    mswDecorator,
  ],
};

export default preview;
