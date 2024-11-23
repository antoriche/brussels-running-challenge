import * as pulumi from "@pulumi/pulumi";
// import * as aws from "@pulumi/aws";

export const config = new pulumi.Config();

export const project = pulumi.getProject();

export const env = pulumi.getStack();

let _region;
switch (process.env.CLOUD) {
  case "azure":
    _region = require("@pulumi/azure-native").config.location;
    break;
  case "aws":
    _region = require("@pulumi/aws").getRegionOutput().name;
    break;
  default:
    _region = undefined;
}

export const region = _region;

export const repository = config.get("repository");

export const branch = config.get("branch");

export const identifier = `${project}-${env}`;
