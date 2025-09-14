const crypto = require('node:crypto');
const { DataBucket } = require('../databucket');
const { DynamoEnrichment } = require('../enrichment/dynamo-enrichment');
const { decide } = require('../engine/decision-engine');
const logger = require('../logger');
const dynamo = new DynamoEnrichment();

async function processOrderAnalysis(input) {
  
  const t0 = process.hrtime.bigint();
  const requestId = input.requestId || crypto.randomUUID();
  logger.info({ evt: 'start', rid: requestId }, 'orderAnalysis');

  // monta payload (bucket)
  const bucket = new DataBucket({
    customerId: input.customerId,
    amount: input.amount,
    currency: input.currency || 'BRL',
    merchantId: input.merchantId || 'unknown'
  });

  // enrichment
  const tEnrStart = process.hrtime.bigint();
  const enr = await dynamo.process({ escopo: 'orderAnalysis', payload: bucket });
  const tEnrMs = Math.round(Number(process.hrtime.bigint() - tEnrStart) / 1e6);
  logger.info({ evt: 'enrich_ok', alias: enr.alias, t_ms: tEnrMs, rid: requestId }, 'orderAnalysis');

  // decision
  const tDecStart = process.hrtime.bigint();
  const { decision, reasons } = decide({ tx: bucket.toJSON(), enrichmentPayload: enr.payload });
  const tDecMs = Math.round(Number(process.hrtime.bigint() - tDecStart) / 1e6);
  logger.info({ evt: 'decide_ok', decision, reasons_cnt: reasons.length, t_ms: tDecMs, rid: requestId }, 'orderAnalysis');

  const totalMs = Math.round(Number(process.hrtime.bigint() - t0) / 1e6);
  logger.info({ evt: 'done', decision, total_ms: totalMs, rid: requestId }, 'orderAnalysis');

  // saída estilo “resultado de pedido”
  return {
    requestId,
    decision,
    reasons,
    enrichment: { [enr.alias]: enr.payload },
    latencyMs: totalMs
  };
}

module.exports = { processOrderAnalysis };