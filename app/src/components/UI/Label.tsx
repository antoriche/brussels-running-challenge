import React from "react";

type LabelProps = {
  children: React.ReactNode;
};

function Label({ children }: LabelProps) {
  return <span style={{ display: "block", color: "grey", fontFamily: "Trebuchet MS" }}>{children}</span>;
}

export default Label;
