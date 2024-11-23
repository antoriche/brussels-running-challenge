import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { identifier } from "../constants";
import { cloudfront } from "./cloudfront";

const config = new pulumi.Config();

const { zoneId, url } = JSON.parse(config.get("domain") || "{}");
if (url && zoneId) {
  const domainZone = aws.route53.Zone.get("domainZone", zoneId);
  const record = new aws.route53.Record(identifier, {
    zoneId: domainZone.zoneId,
    name: url,
    type: "A",
    aliases: [
      {
        name: cloudfront.domainName,
        zoneId: cloudfront.hostedZoneId,
        evaluateTargetHealth: false,
      },
    ],
  });
}
