//
// Parts of this source code were borrowed from the AWS official documentation.
//
// REFERENCE: https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html#actions-invoke-lambda-function-add-action
//

import { CodePipeline, FailureType } from "@aws-sdk/client-codepipeline";
import { CloudFront } from "@aws-sdk/client-cloudfront";
import { iam, lambda } from "@pulumi/aws";

async function put_job_success(job_id, message) {
  //
  // Notify CodePipeline of a successful job
  //
  // Args:
  //     job: The CodePipeline job ID
  //     message: A message to be logged relating to the job status
  // Raises:
  //     Exception: Any exception thrown by .putJobSuccessResult()
  //
  console.log("Reporting job success");
  console.log(message);

  const codepipeline = new CodePipeline({});
  const params = {
    jobId: job_id,
  };
  return codepipeline.putJobSuccessResult(params);
}

async function put_job_failure(job_id, invoke_id, message) {
  //
  // Notify CodePipeline of a failed job
  //
  // Args:
  //     job: The CodePipeline job ID
  //     invoke_id: The current Lambda execution Invoke ID
  //     message: A message to be logged related to the job status
  // Raises:
  //     Exception: Any exception thrown by .putJobFailureResult()
  //
  console.log("Reporting job failure");
  console.log(message);

  const codepipeline = new CodePipeline({});
  const params = {
    failureDetails: {
      message,
      type: FailureType.JobFailed,
      externalExecutionId: invoke_id,
    },
    jobId: job_id,
  };
  return codepipeline.putJobFailureResult(params);
}

function get_user_params(job_data) {
  //
  // Decodes the JSON user parameters and validates the required properties.
  //
  // Args:
  //     job_data: The job data structure containing the UserParameters string which should be a valid JSON structure
  // Returns:
  //     The JSON parameters decoded as a dictionary.
  // Raises:
  //     Exception: The JSON can't be decoded or a property is missing.
  //
  let decoded_parameters;
  try {
    // Get the user parameters which contain the stack, artifact and file settings
    const user_parameters = job_data.actionConfiguration.configuration.UserParameters;
    console.log("UserParameters:");
    console.log(user_parameters);
    decoded_parameters = JSON.parse(user_parameters);
  } catch (ex) {
    // We're expecting the user parameters to be encoded as JSON
    // so we can pass multiple values. If the JSON can't be decoded
    // then fail the job with a helpful message.
    throw new Error("UserParameters could not be decoded as JSON");
  }

  const EXAMPLE_OF_USER_PARAMETERS = `{
  "distributionId": "FP7AWS1WBJLKSX",
  "objectPaths": [
    "/foo",
    "/bar/baz.jpg",
    "/bar/baz/*"
  ]
}`;

  if (!("distributionId" in decoded_parameters)) {
    // Validate that the distribution ID is provided, otherwise fail the job
    // with a helpful message.
    throw new Error(
      `${
        "Your UserParameters JSON must include the CloudFront Distribution ID to be invalidated.\n" + "Example of a valid UserParameters:\n"
      }${EXAMPLE_OF_USER_PARAMETERS}`,
    );
  }

  if (!("objectPaths" in decoded_parameters)) {
    // Validate that the object paths are provided, otherwise fail the job
    // with a helpful message.
    throw new Error(
      `${
        "Your UserParameters JSON must include the object paths to invalidate.\n" + "Example of a valid UserParameters:\n"
      }${EXAMPLE_OF_USER_PARAMETERS}`,
    );
  }

  return decoded_parameters;
}

async function invalidate_cloudfront_distribution(distribution_id, object_paths) {
  const cloudfront = new CloudFront({});
  return cloudfront.createInvalidation({
    DistributionId: distribution_id,
    InvalidationBatch: {
      CallerReference: `cloudfront-invalite-dist-${new Date().getTime()}`,
      Paths: {
        Quantity: object_paths.length,
        Items: object_paths,
      },
    },
  });
}

async function lambda_handler(event, context) {
  let response = {};

  // Extract the Job ID
  const job_id = event["CodePipeline.job"].id;

  // Extract the Job Data
  const job_data = event["CodePipeline.job"].data;

  try {
    // Extract the user parameters
    const params = get_user_params(job_data);

    const distribution_id = params.distributionId;
    const object_paths = params.objectPaths;

    await invalidate_cloudfront_distribution(distribution_id, object_paths);

    await put_job_success(job_id, "Completed");

    const body = {
      message: "Success!",
      input: event,
    };

    response = {
      statusCode: 200,
      body: JSON.stringify(body),
    };
  } catch (ex) {
    // If any exception is raised, fail the job and log the exception message.
    console.error("Function failed due to exception.");
    console.error(ex);

    await put_job_failure(job_id, context.invokeid, `Function exception: ${JSON.stringify(ex)}`);

    const body = {
      message: JSON.stringify(ex),
      input: event,
    };

    response = {
      statusCode: 500,
      body: JSON.stringify(body),
    };
  }

  return response;
}

export const invalidateCloudfrontRole = new iam.Role("cloudfront-invalidate-role", {
  assumeRolePolicy: `{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }
  `,
});

export const invalidateCloudfrontLambda = new lambda.CallbackFunction("cloudfront-invalidate", {
  callback: lambda_handler,
  role: module.exports.invalidateCloudfrontRole,
});
