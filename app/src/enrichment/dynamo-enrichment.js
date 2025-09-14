const { Enrichment } = require('./index');
const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const TABLE = process.env.FOS_TABLE || 'orchestrator_enrichment';
const REGION = process.env.AWS_REGION || 'us-east-1';
const ENDPOINT = process.env.AWS_ENDPOINT_URL || 'http://localhost:4566';

function ddb() {
  return new DynamoDBClient({
    region: REGION, endpoint: ENDPOINT,
    credentials: { accessKeyId: 'mock', secretAccessKey: 'mock' }
  });
}

/** Enrichment que busca perfil/risco/blacklist do cliente no DynamoDB */
class DynamoEnrichment extends Enrichment {
  constructor() { super('dynamo'); }
  async process(request /* { escopo, payload: DataBucket } */) {
    const customerId = request.payload.get('customerId');
    if (!customerId) return { alias: this.alias, payload: {} };

    const out = await ddb().send(new GetItemCommand({
      TableName: TABLE,
      Key: marshall({ customerId })
    }));
    const payload = out.Item ? unmarshall(out.Item) : {};
    return { alias: this.alias, payload };
  }
}

module.exports = { DynamoEnrichment };