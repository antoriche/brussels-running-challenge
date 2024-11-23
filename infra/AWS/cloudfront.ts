import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { identifier } from "../constants";

const config = new pulumi.Config();

const { zoneId, url, certificateArn } = JSON.parse(config.get("domain") || "{}");

export const bucket = new aws.s3.Bucket(identifier.toLowerCase(), {
  acl: "private",
});

export const cloudfront_origin = new aws.cloudfront.OriginAccessIdentity(identifier.toLowerCase(), {
  comment: identifier,
});

const bucketPolicy = new aws.s3.BucketPolicy("allowCloudfrontAccess", {
  bucket: bucket.id,
  policy: aws.iam
    .getPolicyDocumentOutput({
      statements: [
        {
          actions: ["s3:GetObject"],
          resources: [pulumi.interpolate`${bucket.arn}/*`],
          principals: [
            {
              type: "AWS",
              identifiers: [pulumi.interpolate`${cloudfront_origin.iamArn}`],
            },
          ],
        },
      ],
    })
    .apply((s3Policy) => s3Policy.json),
});

export const cloudfront = new aws.cloudfront.Distribution(identifier, {
  enabled: true,
  origins: [
    {
      domainName: bucket.bucketRegionalDomainName,
      originId: identifier,
      s3OriginConfig: {
        originAccessIdentity: cloudfront_origin.cloudfrontAccessIdentityPath,
      },
    },
  ],
  aliases: [url],
  defaultCacheBehavior: {
    allowedMethods: ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
    cachedMethods: ["GET", "HEAD"],
    targetOriginId: identifier,
    forwardedValues: {
      queryString: false,
      cookies: {
        forward: "none",
      },
    },
    viewerProtocolPolicy: "allow-all",
    minTtl: 0,
    defaultTtl: 3600,
    maxTtl: 86400,
  },
  customErrorResponses: [
    {
      errorCode: 404,
      responseCode: 200,
      responsePagePath: "/index.html",
    },
    {
      errorCode: 403,
      responseCode: 200,
      responsePagePath: "/index.html",
    },
  ],
  restrictions: {
    geoRestriction: {
      restrictionType: "none",
    },
  },
  viewerCertificate: {
    cloudfrontDefaultCertificate: !certificateArn,
    acmCertificateArn: certificateArn,
    sslSupportMethod: "sni-only",
    minimumProtocolVersion: "TLSv1.2_2021",
  },
  isIpv6Enabled: true,
  comment: identifier,
  defaultRootObject: "index.html",
});
