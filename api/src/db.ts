import knex from "knex";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

const { APIENV_AWS_DB_SECRET_ARN } = process.env;
const secretManager = new SecretsManager({});

async function getSecretValue(secretId: string) {
  const result = await secretManager.getSecretValue({ SecretId: secretId });
  if (!result.SecretString) {
    throw new Error(`no data in secret ${secretId}`);
  }
  return JSON.parse(result.SecretString);
}

const basicMerge = (items) => items;

export const aggregateRows = (data, identifier, merge = basicMerge) => {
  const groupBy = data.reduce((ret, curr) => {
    if (!curr[identifier]) return ret;
    ret[curr[identifier]] = [...(ret[curr[identifier]] || []), curr];
    return ret;
  }, {});

  return Object.entries(groupBy).map(([, items]) => merge(items));
};

export default async function db() {
  const secret = await getSecretValue(APIENV_AWS_DB_SECRET_ARN!);
  const { username: user, password, database, port, endpoint: host } = secret;
  return knex({
    client: "pg",
    connection: {
      host,
      port,
      user,
      password,
      database,
    },
  });
}
