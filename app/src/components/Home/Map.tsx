import React, { useEffect } from "react";
import * as Plot from "@observablehq/plot";
import brusselsStreets from "../../data/brussels_streets.json";
import * as d3 from "d3";
import "svg-pan-zoom-container";
import GeoJSON from "geojson";
import _ from "lodash";
import { createIntermediatePointsInFeatureCollection } from "../../services/mapUtils";

type MapProps = {
  highlight: GeoJSON.FeatureCollection | null;
};
function Map({ highlight }: MapProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const brussels_street_points = _(createIntermediatePointsInFeatureCollection(brusselsStreets as GeoJSON.FeatureCollection, 30)["features"])
      .map((street) => street.geometry)
      .map((geometry) => {
        if (geometry?.type === "LineString") {
          return geometry.coordinates;
        } else if (geometry?.type === "MultiLineString") {
          return geometry.coordinates.flat();
        } else {
          return [];
        }
      })
      .flatten()
      .uniqBy(([lon, lat]) => `${lon},${lat}`)
      .sort()
      .value();


    const svg = Plot.plot({
      width,
      height,
      projection: {
        type: "mercator",
        //rotate: [-9, -34],
        domain: brusselsStreets,
        //inset: -1000,
      },
      marks: [
        Plot.geo(brusselsStreets, {
          //fill: "red",
          stroke: "lightgrey",
          strokeWidth: 0.3,
          // opacity: 0.5,
          //title: d => d.properties.timestamp
        }),
        Plot.geo(highlight || [], {
          //fill: "red",
          stroke: "gold",
          strokeWidth: 1,
          // opacity: 0.5,
          //title: d => d.properties.timestamp
        }),


        //highlight2 &&
        //  Plot.geo(highlight2, {
        //    //fill: "red",
        //    stroke: "green",
        //    strokeWidth: 0.7,
        //    opacity: 0.5,
        //    //title: d => d.properties.timestamp
        //  }),

        // Plot.dot(brussels_street_points, {
        //   r: 0.1,
        //   fill: "black",
        // }),
      ],
    });
    d3.select(svg)
      .on("mousedown", () => {
        container.style.cursor = "grabbing";
      })
      .on("mouseup", () => {
        container.style.cursor = "grab";
      });
    container.appendChild(svg);
    return () => {
      container.removeChild(svg);
    };
  }, [highlight]);

  return (
    <div
      data-zoom-on-wheel
      data-pan-on-drag
      style={{
        overflow: "hidden",
        height: 640,
        maxHeight: "90vh",
      }}
    >
      <div ref={ref} />
    </div>
  );
}

export default Map;
