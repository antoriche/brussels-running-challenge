import { Checkbox, CheckboxProps } from "antd";
import React from "react";
import styled, { css } from "styled-components";

type CustomCheckboxProps = CheckboxProps & {
  backgroundColor?: string;
};
function CustomCheckbox(props: CustomCheckboxProps) {
  return (
    <>
      {React.createElement(
        styled(Checkbox)`
          ${(props) =>
            props.backgroundColor &&
            css`
              & .ant-checkbox-checked .ant-checkbox-inner {
                background-color: ${props.backgroundColor};
                border-color: ${props.backgroundColor};
              }
            `}
        `,
        props,
      )}
    </>
  );
}

export default CustomCheckbox;
