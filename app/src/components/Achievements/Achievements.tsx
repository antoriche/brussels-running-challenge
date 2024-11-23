import React from "react";
import { useRunPath } from "../../hooks/useRunPath";
import { Col, Progress, Row } from "antd";
import challenges, { Challenge } from "./challenges";

import { useWorker } from "@koale/useworker";
import { useQuery } from "@tanstack/react-query";
import { FeatureCollection, GeoJsonProperties, LineString } from "geojson";

const workerFn = (ranGeojson: FeatureCollection<LineString, GeoJsonProperties>, challenges: Challenge[]) => {
  console.log("worker");
  return challenges
    .map<
      Challenge & {
        percent: number;
      }
    >((challenge) => ({
      ...challenge,
      percent: challenge.percentage(ranGeojson) * 100,
    }))
    .sort((a, b) => b.percent - a.percent);
};

function Achievements() {
  const ranGeojson = useRunPath();
  const [worker, workerController] = useWorker(workerFn);

  const { data: sortedChallenges = [] } = useQuery({
    queryKey: ["sortedChallenges", ranGeojson],
    queryFn: async () => {
      if (!ranGeojson) return [];
      await workerController.kill();

      console.log("navigator", navigator.serviceWorker);
      console.log("queryFn", ranGeojson);
      const result = await worker(ranGeojson, challenges);
      console.log("result", result);
      return result;
    },
  });

  return (
    <div
      style={{
        padding: 30,
      }}
    >
      <Row gutter={[16, 16]} style={{}} justify={"start"}>
        {sortedChallenges.map((challenge) => (
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
