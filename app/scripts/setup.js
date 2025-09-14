const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const REGION = process.env.AWS_REGION || 'us-east-1';
const ENDPOINT = process.env.AWS_ENDPOINT_URL || 'http://localhost:4566';
const TABLE = process.env.FOS_TABLE || 'orchestrator_enrichment';

const ddb = new DynamoDBClient({
  region: REGION, endpoint: ENDPOINT,
  credentials: { accessKeyId: 'mock', secretAccessKey: 'mock' }
});

async function exists() {
  try { await ddb.send(new DescribeTableCommand({ TableName: TABLE })); return true; }
  catch { return false; }
}

(async () => {
  if (await exists()) { console.log(`[setup] ${TABLE} já existe`); return; }
  await ddb.send(new CreateTableCommand({
    TableName: TABLE,
    BillingMode: 'PAY_PER_REQUEST',
    AttributeDefinitions: [{ AttributeName: 'customerId', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'customerId', KeyType: 'HASH' }]
  }));
  console.log(`[setup] criada ${TABLE}`);
})().catch(e => (console.error(e), process.exit(1)));