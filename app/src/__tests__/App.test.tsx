import "@testing-library/jest-dom";
import App from "../App";
import { render } from "../setupTests";
import React from "react";

describe("General app testing", () => {
  test(`App should have a rendering`, () => {
    const { container } = render(<App />);
    expect(container).not.toBeEmptyDOMElement();
  });

  test(`console should not contain error messages`, async () => {
    const spy = jest.spyOn(console, "error");
    render(<App />);
    expect(spy).not.toHaveBeenCalled();
  });

  //   test(`Layout should match snapshot`, () => {
  //     // jest.mock("react-router", () => ({
  //     //   ...jest.requireActual("react-router"),
  //     //   useMatches: () => [],
  //     // }));
  //     const { container } = render(<Layout />);
  //     expect(container).toMatchSnapshot();
  //   });
});
