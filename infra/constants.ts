import * as pulumi from "@pulumi/pulumi";
// import * as aws from "@pulumi/aws";

export const config = new pulumi.Config();

export const project = pulumi.getProject();

export const env = pulumi.getStack();

export const region = require("@pulumi/aws").getRegionOutput().name;

export const repository = config.get("repository");

export const branch = config.get("branch");

export const identifier = `${project}-${env}`;
