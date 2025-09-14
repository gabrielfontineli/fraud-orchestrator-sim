const crypto = require('node:crypto');
const { DataBucket } = require('../databucket');
const { DynamoEnrichment } = require('../enrichment/dynamo-enrichment');
const { decide } = require('../engine/decision-engine');

const dynamo = new DynamoEnrichment();

async function processOrderAnalysis(input) {
  // input: { customerId, amount, currency, merchantId, ... }
  const requestId = input.requestId || crypto.randomUUID();

  // monta payload (bucket)
  const bucket = new DataBucket({
    customerId: input.customerId,
    amount: input.amount,
    currency: input.currency || 'BRL',
    merchantId: input.merchantId || 'unknown'
  });

  // enrichment
  const enr = await dynamo.process({ escopo: 'orderAnalysis', payload: bucket });

  // decision
  const { decision, reasons } = decide({ tx: bucket.toJSON(), enrichmentPayload: enr.payload });

  // saída estilo “resultado de pedido”
  return {
    requestId,
    decision,
    reasons,
    enrichment: { [enr.alias]: enr.payload }
  };
}

module.exports = { processOrderAnalysis };