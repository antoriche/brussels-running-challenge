import * as pulumi from "@pulumi/pulumi";
import * as azureNative from "@pulumi/azure-native";
import { identifier } from "../constants";

const ressourceGroup = new azureNative.resources.ResourceGroup(identifier, {
  resourceGroupName: identifier,
});

const webapp = new azureNative.web.StaticSite("webapp", {
  resourceGroupName: ressourceGroup.name,
  name: identifier,
  repositoryUrl: "",
  sku: {
    name: "Free",
    tier: "Free",
  },
});

const webapp_secrets = webapp.id.apply(() =>
  // depends on
  azureNative.web.listStaticSiteSecretsOutput({
    resourceGroupName: ressourceGroup.name,
    name: webapp.name,
  }),
);

const deploymentToken = webapp_secrets.properties.apply((properties) => properties.apiKey);

export const appUrl = pulumi.interpolate`https://${webapp.defaultHostname}`;

export const appDeploymentToken = deploymentToken;

export const resourceGroupName = ressourceGroup.name;

export const deploymentName = identifier;
