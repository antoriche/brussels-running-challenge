import { fn } from "@storybook/test";
import CustomCheckbox from "./CustomCheckbox";

export default {
  title: "UI/CustomCheckbox",
  component: CustomCheckbox,

  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: { control: "color" },
    children: { control: "text" },
  },
  args: { onClick: fn() },
};

export const Default = {
  args: {
    backgroundColor: "purple",
    children: "Custom Checkbox",
  },
};
