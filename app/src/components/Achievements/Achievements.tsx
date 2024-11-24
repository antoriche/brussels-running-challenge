import React, { useMemo } from "react";
import { Col, Progress, Row } from "antd";

type AchievementsProps = {
  percentByCommune: Record<string, number>;
};

function Achievements({ percentByCommune }: AchievementsProps) {
  const challenges = useMemo(
    () =>
      Object.entries(percentByCommune)
        .map(([commune, percent]) => ({
          name: `Run in ${commune}`,
          percent: percent * 100,
        }))
        .sort((a, b) => b.percent - a.percent),
    [percentByCommune],
  );

  return (
    <div
      style={{
        padding: 30,
      }}
    >
      <Row gutter={[16, 16]} style={{}} justify={"start"}>
        {challenges.map((challenge) => (
          <Col
            key={challenge.name}
            span={8}
            sm={24}
            xs={24}
            md={12}
            xl={8}
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
              <Progress percent={challenge.percent} format={(percent = 0) => `${percent.toFixed(0)}%`} strokeColor="gold" />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Achievements;
