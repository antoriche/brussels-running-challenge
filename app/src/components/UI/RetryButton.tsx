import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import React from "react";

export default function RetryButton() {
  const navigate = useNavigate();

  function handleClick() {
    navigate(0);
  }

  return (
    <Button type="primary" onClick={handleClick}>
      Retry
    </Button>
  );
}
