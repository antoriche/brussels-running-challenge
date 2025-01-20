import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import { StravaApi } from "./helpers/strava";

export async function listActivities(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { Authorization } = event.headers;
  if (!Authorization) {
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: "Unauthorized" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
  const strava = new StravaApi(Authorization);
  let query: Awaited<ReturnType<StravaApi["listActivities"]>> = [];
  try {
    let queryTmp: typeof query = [];
    let i = 1;
    const PER_PAGE = 200;
    do {
      queryTmp = await strava.listActivities({ page: i, per_page: PER_PAGE });
      query = query.concat(queryTmp);
      i++;
    } while (queryTmp.length > 0 && queryTmp.length === PER_PAGE);
    //query = await strava.listActivities({ page: 1, per_page: 5 });

    query = query.filter((activity) => activity.type === "Run" && activity.location_country === "Belgium");

    query = await Promise.all(
      query.map(async (activity) => {
        //const details = await strava.getActivity(activity.id);
        const gpx = null; // await strava.getGPX(activity.id);
        return {
          ...activity,
          gpx,
          //map: details.map,
        };
      }),
    );
  } catch (error) {
    console.error("fail", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(query),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
}
