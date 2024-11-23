import React from "react";
import { useRunPath } from "../../hooks/useRunPath";
import { Col, Progress, Row } from "antd";
import challenges from "./challenges";


function Achievements() {
  const ranGeojson = useRunPath();

  console.log(challenges);

  return <div style={{
    padding: 30
  }}><Row gutter={[16, 16]} style={{}} justify={"start"}>
      {challenges.map((challenge) => {
        const percent = ranGeojson ? challenge.percentage(ranGeojson) * 100 : 0;
        return [percent, (
          <Col key={challenge.name} span={8} sm={24} xs={24} md={12} xl={8}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 300,
                backgroundColor: "#F0F0F030",
                padding: 20,
                borderRadius: 10,
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3>{challenge.name}</h3>
              <Progress
                percent={percent}
                format={(percent) => percent && `${percent.toFixed(0)}%`}
                strokeColor="gold"
              />
            </div>
          </Col>
        )] as const;
      }).sort((a, b) => b[0] - a[0]).map(([, component]) => component)}
    </Row></div>
}

export default Achievements;
