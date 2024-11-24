import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { identifier, repository, branch, env, region } from "../constants";
import { pool, client } from "./userPool";
import { createCodebuild } from "./buildStage";
import { invalidateCloudfrontLambda, invalidateCloudfrontRole } from "./cloudfront-invalidate";
import { cloudfront, bucket } from "./cloudfront";

import "./domain";

const config = new pulumi.Config();
const githubConnection = new aws.codestarconnections.Connection(identifier, { name: identifier, providerType: "GitHub" });

const codepipelineBucket = new aws.s3.Bucket(`${identifier}-codepipeline`.toLowerCase(), { acl: "private" });

const codepipelineRole = new aws.iam.Role(`${identifier}-codepipeline`, {
  assumeRolePolicy: `{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "codepipeline.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }
  `,
});

const apiGateway = new aws.apigateway.RestApi(`${identifier}`, {});

const exampleResource = new aws.apigateway.Resource("exampleResource", {
  parentId: apiGateway.rootResourceId,
  pathPart: "example",
  restApi: apiGateway.id,
});
const exampleMethod = new aws.apigateway.Method("exampleMethod", {
  authorization: "NONE",
  httpMethod: "GET",
  resourceId: exampleResource.id,
  restApi: apiGateway.id,
});
const exampleIntegration = new aws.apigateway.Integration("exampleIntegration", {
  httpMethod: exampleMethod.httpMethod,
  resourceId: exampleResource.id,
  restApi: apiGateway.id,
  type: "MOCK",
});

const apiGatewayDeployment = new aws.apigateway.Deployment(
  `${identifier}-deployment`,
  {
    restApi: apiGateway.id,
    stageName: env,
  },
  {
    dependsOn: [exampleIntegration],
  },
);

const codepipeline = new aws.codepipeline.Pipeline(identifier, {
  name: identifier,
  roleArn: codepipelineRole.arn,
  artifactStores: [
    {
      location: codepipelineBucket.bucket,
      type: "S3",
    },
  ],
  stages: [
    {
      name: "Source",
      actions: [
        {
          name: "Source",
          category: "Source",
          owner: "AWS",
          provider: "CodeStarSourceConnection",
          version: "1",
          outputArtifacts: ["source_output"],
          configuration: {
            ConnectionArn: githubConnection.arn,
            FullRepositoryId: pulumi.interpolate`${repository}`,
            BranchName: pulumi.interpolate`${branch}`,
          },
        },
      ],
    },
    {
      name: "Build",
      actions: [
        {
          name: "App",
          category: "Build",
          owner: "AWS",
          provider: "CodeBuild",
          inputArtifacts: ["source_output"],
          outputArtifacts: ["app_build_output"],
          version: "1",
          configuration: {
            ProjectName: createCodebuild("app-build", "./buildspecs/react-build.yml", {
              environment: {
                REACT_APP_API_URL: apiGatewayDeployment.invokeUrl,
                ...JSON.parse(config.get("app-env") || "{}"),
                REACT_APP_COGNITO_REGION: region,
                REACT_APP_COGNITO_USER_POOL_ID: pool.id,
                REACT_APP_COGNITO_APP_CLIENT_ID: client.id,
                DISABLE_ESLINT_PLUGIN:true
              },
              codepipelineBucket: codepipelineBucket.arn,
            }),
          },
        },
        {
          name: "Api",
          category: "Build",
          owner: "AWS",
          provider: "CodeBuild",
          inputArtifacts: ["source_output"],
          outputArtifacts: ["api_build_output"],
          version: "1",
          configuration: {
            ProjectName: createCodebuild("api-build", "./buildspecs/serverless.yml", {
              environment: {
                ...JSON.parse(config.get("api-env") || "{}"),
                PREFIX: `APIENV_`,
                ENV: env,
                APIENV_COGNITO_ARN: pool.arn,
                API_GATEWAY_ID: apiGateway.id,
                API_GATEWAY_ROOT_ID: apiGateway.rootResourceId,
                APIENV_STRAVA_CLIENT_SECRET: config.require('strava-client-secret')
              },
              environmentSecretKeys: ["PULUMI_ACCESS_TOKEN"],
              codepipelineBucket: codepipelineBucket.arn,
            }),
          },
        },
      ],
    },
    {
      name: "Deploy",
      actions: [
        {
          name: "App",
          category: "Deploy",
          owner: "AWS",
          provider: "S3",
          version: "1",
          inputArtifacts: ["app_build_output"],
          configuration: {
            BucketName: bucket.bucket,
            Extract: "true",
          },
        },
      ],
    },
    {
      name: "CacheInvalidation",
      actions: [
        {
          name: "CacheInvalidation",
          category: "Invoke",
          owner: "AWS",
          provider: "Lambda",
          version: "1",
          configuration: {
            FunctionName: invalidateCloudfrontLambda.name,
            UserParameters: cloudfront.id.apply((id) => JSON.stringify({ distributionId: id, objectPaths: ["/*"] })),
          },
        },
      ],
    },
  ],
});

const codepipelinePolicy = new aws.iam.RolePolicy(identifier, {
  role: codepipelineRole.id,
  policy: pulumi.interpolate`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect":"Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:GetBucketVersioning",
        "s3:PutObjectAcl",
        "s3:PutObject"
      ],
      "Resource": [
        "${codepipelineBucket.arn}",
        "${codepipelineBucket.arn}/*",
        "${bucket.arn}",
        "${bucket.arn}/*"
      ]
    },
    {
      "Effect":"Allow",
      "Action": ["lambda:InvokeFunction"],
      "Resource": ["${invalidateCloudfrontLambda.arn}"]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codestar-connections:UseConnection"
      ],
      "Resource": "${githubConnection.arn}"
    },
    {
      "Effect": "Allow",
      "Action": [
        "codebuild:BatchGetBuilds",
        "codebuild:StartBuild"
      ],
      "Resource": "*"
    }
  ]
}
`,
});

const cloudfrontInvalidateRolePolicy = new aws.iam.RolePolicy(`cloudfront-invalidate-role-policy`, {
  role: invalidateCloudfrontRole.name,
  policy: aws.iam
    .getPolicyDocumentOutput({
      statements: [
        {
          effect: "Allow",
          actions: ["cloudfront:createInvalidation"],
          resources: [cloudfront.arn],
        },
        {
          effect: "Allow",
          actions: ["codepipeline:PutJobFailureResult", "codepipeline:PutJobSuccessResult"],
          resources: ["*"],
        },
        {
          effect: "Allow",
          actions: ["logs:*"],
          resources: ["*"],
        },
      ],
    })
    .apply((policy) => policy.json),
});

export const url = cloudfront.domainName;

export const cognito_user_pool_id = pool.id;

export const cognito_app_client_id = client.id;

export { region } from "../constants";
