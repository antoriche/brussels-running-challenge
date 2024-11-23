import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as fs from "fs";
import { identifier } from "../constants";

interface Config {
  timeout?: number;
  environment?: { [key: string]: string };
  environmentSecretKeys?: [string];
  codepipelineBucket?: pulumi.Output<string>;
}

export const createCodebuild = (name_, buildspec, config: Config = {}) => {
  const name = `${identifier}-${name_}`;

  const bucket = new aws.s3.Bucket(`${name}-bucket`.toLowerCase(), { acl: "private" });
  const role = new aws.iam.Role(`${name}-role`, {
    assumeRolePolicy: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
`,
  });

  const x = pulumi
    .output([
      bucket.arn,
      bucket.arn && pulumi.interpolate`${bucket.arn}/*`,
      config.codepipelineBucket,
      config.codepipelineBucket && pulumi.interpolate`${config.codepipelineBucket}/*`,
    ])
    .apply((a) => a.filter((arn) => !!arn));
  const rolePolicy = new aws.iam.RolePolicy(`${name}-role-policy`, {
    role: role.name,
    policy: aws.iam
      .getPolicyDocumentOutput({
        statements: [
          {
            effect: "Allow",
            actions: [
              "cloudformation:*",
              "s3:*",
              "cloudwatch:*",
              "lambda:*",
              "ec2:*",
              "logs:*",
              "cloudfront:*",
              "iam:*",
              "apigateway:*",
              "events:*",
              "cognito:*",
            ],
            resources: ["*"],
          },
          {
            effect: "Allow",
            actions: ["s3:*"],
            resources: pulumi
              .output(
                [
                  bucket.arn,
                  bucket.arn && pulumi.interpolate`${bucket.arn}/*`,
                  config.codepipelineBucket,
                  config.codepipelineBucket && pulumi.interpolate`${config.codepipelineBucket}/*`,
                ].filter((arn) => !!arn) as Array<pulumi.Output<string>>,
              )
              .apply((a) => a?.filter((arn) => !!arn) as NonNullable<typeof a>),
          },
          {
            effect: "Allow",
            actions: ["secretsmanager:GetSecretValue"],
            resources: ["*"],
          },
        ],
      })
      .apply((policy) => policy.json),
  });
  const project = new aws.codebuild.Project(name, {
    buildTimeout: config.timeout,
    serviceRole: role.arn,
    artifacts: {
      type: "NO_ARTIFACTS",
    },
    cache: {
      type: "S3",
      location: bucket.bucket,
    },
    environment: {
      computeType: "BUILD_GENERAL1_SMALL",
      image: "aws/codebuild/standard:1.0",
      type: "LINUX_CONTAINER",
      privilegedMode: true,
      imagePullCredentialsType: "CODEBUILD",
      environmentVariables: Object.entries(config.environment || {}).reduce(
        (arr: Array<{ name: string; value: string; type: string }>, [key, value]: [string, string]) => [
          ...arr,
          {
            name: key,
            value,
            type: (config.environmentSecretKeys || ([] as string[])).includes(key) ? "SECRETS_MANAGER" : "PLAINTEXT",
          },
        ],
        [] satisfies Array<{ name: string; value: string; type: string }>,
      ),
    },
    logsConfig: {
      s3Logs: {
        status: "ENABLED",
        location: pulumi.interpolate`${bucket.id}/build-log`,
      },
    },
    source: {
      type: "NO_SOURCE",
      buildspec: fs.readFileSync(buildspec, "utf8"),
    },
  });
  return project.name;
};
