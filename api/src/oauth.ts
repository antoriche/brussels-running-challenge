import axios from "axios";
import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { code } = JSON.parse(event.body || "{}");

  let tokenQuery;
  try {
    const query = await axios.post("https://www.strava.com/api/v3/oauth/token", {
      grant_type: "authorization_code",
      client_id: process.env.APIENV_STRAVA_CLIENT_ID,
      code: code,
      client_secret: process.env.APIENV_STRAVA_CLIENT_SECRET,
    });
    tokenQuery = query.data;
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  console.log(tokenQuery);

  return {
    statusCode: 200,
    body: JSON.stringify({ ...tokenQuery }),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
}
