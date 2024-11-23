import {fileURLToPath} from "node:url";
import {readFile} from "node:fs/promises";

const brussels_streets1 = await readFile(fileURLToPath(import.meta.resolve("./brussels_streets1.geojson")), "utf-8");
const brussels_streets2 = await readFile(fileURLToPath(import.meta.resolve("./brussels_streets2.geojson")), "utf-8");

console.log("brussels_streets1",brussels_streets1);
const brussels_streets = {
  type: "FeatureCollection",
  features: [
    ...brussels_streets1.features,
    ...brussels_streets2.features,
  ]
};

process.stdout.write(JSON.stringify(brussels_streets));