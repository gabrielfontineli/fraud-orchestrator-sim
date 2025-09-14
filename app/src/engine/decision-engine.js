// Regras básicas: BLACKLIST, HIGH_RISK_SCORE, AMOUNT_ABOVE_PROFILE
function decide({ tx, enrichmentPayload }) {
  const reasons = [];

  if (enrichmentPayload?.isBlacklisted === true) reasons.push('BLACKLISTED');
  if (typeof enrichmentPayload?.riskScore === 'number' && enrichmentPayload.riskScore >= 80) reasons.push('HIGH_RISK_SCORE');

  const avg = typeof enrichmentPayload?.avgTicket === 'number' ? enrichmentPayload.avgTicket : 100;
  const mult = typeof enrichmentPayload?.maxAmountMultiplier === 'number' ? enrichmentPayload.maxAmountMultiplier : 3;
  if (typeof tx.amount === 'number' && tx.amount > avg * mult) reasons.push('AMOUNT_ABOVE_PROFILE');

  const decision = reasons.length ? 'FRAUD' : 'NOT_FRAUD';
  return { decision, reasons };
}

module.exports = { decide };