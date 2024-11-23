import { render as testingRender } from "@testing-library/react";

global.URL.createObjectURL = jest.fn();

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

/*const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});*/

export const render = testingRender;
