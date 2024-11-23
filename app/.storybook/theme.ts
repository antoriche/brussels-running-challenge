import { create } from "@storybook/theming/create";
import logo from "../src/assets/images/JetpackLogoOnly.png";
import { name } from "../../package.json";

export default create({
  base: "light",
  brandTitle: `<div style="display: flex; flex-direction: row; align-items: center; gap: 10px; "><img src="${logo}" height="28em"/> ${name}<div>`,
  brandTarget: "_self",
});
