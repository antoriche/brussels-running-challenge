import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 *  Emulating api gateway event
 */
function transformAzureEvent(event: Context, req: HttpRequest): APIGatewayProxyEvent {
  return {
    body: req.body,
    headers: req.headers,
    httpMethod: req.method || "unknown",
    isBase64Encoded: false,
    multiValueHeaders: Object.entries(req.headers).reduce(
      (acc, [key, value]) => {
        acc[key] = [value];
        return acc;
      },
      {} as { [key: string]: string[] },
    ),
    multiValueQueryStringParameters: Object.entries(req.query).reduce(
      (acc, [key, value]) => {
        acc[key] = [value];
        return acc;
      },
      {} as { [key: string]: string[] },
    ),
    path: req.url,
    pathParameters: req.params,
    queryStringParameters: req.query,
    stageVariables: {},
    requestContext: null!, // TODO: this is a hack, seems not useful but might need to fill if necessary
    resource: req.url.split("?")[0],
  };
}

export function azureWrapper(func: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>): AzureFunction {
  return async (context: Context, req: HttpRequest) => {
    try {
      const res = await func(transformAzureEvent(context, req));
      context.res = {
        status: res.statusCode || 200,
        body: res.body || "",
        headers: {
          "Access-Control-Allow-Origin": "*",
          ...res.headers,
        },
      };
    } catch (err) {
      context.res = {
        status: err.status || 500,
        body: err.message || "Internal server error",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      };
    }
  };
}
