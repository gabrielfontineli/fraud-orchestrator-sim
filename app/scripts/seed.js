const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

const REGION = process.env.AWS_REGION || 'us-east-1';
const ENDPOINT = process.env.AWS_ENDPOINT_URL || 'http://localhost:4566';
const TABLE = process.env.FOS_TABLE || 'orchestrator_enrichment';

const ddb = new DynamoDBClient({
  region: REGION, endpoint: ENDPOINT,
  credentials: { accessKeyId: 'mock', secretAccessKey: 'mock' }
});

const rows = [
  { customerId: 'cust-100', isBlacklisted: true,  riskScore: 92, avgTicket: 50,  maxAmountMultiplier: 2 },
  { customerId: 'cust-200', isBlacklisted: false, riskScore: 20, avgTicket: 120, maxAmountMultiplier: 3 },
  { customerId: 'cust-300', isBlacklisted: false, riskScore: 75, avgTicket: 80,  maxAmountMultiplier: 2 }
];

(async () => {
  for (const r of rows) {
    await ddb.send(new PutItemCommand({ TableName: TABLE, Item: marshall(r) }));
    console.log(`[seed] upsert ${r.customerId}`);
  }
  console.log('[seed] done');
})().catch(e => (console.error(e), process.exit(1)));