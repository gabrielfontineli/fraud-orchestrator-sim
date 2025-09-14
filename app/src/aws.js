const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

function createDynamoClient() {
  const endpoint = process.env.AWS_ENDPOINT_URL || 'http://localhost:4566';
  const region = process.env.AWS_REGION || 'us-east-1';

  return new DynamoDBClient({
    region,
    endpoint,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock'
    }
  });
}

async function listTables() {
  const client = createDynamoClient();
  const resp = await client.send(new ListTablesCommand({}));
  return resp.TableNames || [];
}

module.exports = { createDynamoClient, listTables };
