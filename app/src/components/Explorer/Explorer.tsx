import { Input, Row, Col } from "antd";
import React, { useState } from "react";
import Label from "../UI/Label";

function Explorer() {
  const [tempName, setTempName] = useState<string>("");
  const [name, setName] = useState<string>("");

  return (
    <div style={{ height: "calc(100vh - 64px)", padding: 8 }}>
      <Row style={{ height: "100%" }} gutter={8}>
        <Col span={8} style={{ height: "100%" }}>
          <div style={{ padding: 16, backgroundColor: "white", height: "100%", overflowY: "scroll" }}>
            <Label>Name</Label>
            <Input
              style={{ width: 200 }}
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={() => setName(tempName)}
              allowClear
            />
          </div>
        </Col>
        <Col span={16}>
          <div style={{ padding: 16, backgroundColor: "white", height: "100%", overflowY: "scroll" }}></div>
        </Col>
      </Row>
    </div>
  );
}

export default Explorer;
