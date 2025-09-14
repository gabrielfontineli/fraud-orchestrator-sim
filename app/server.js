const express = require('express');
const { processOrderAnalysis } = require('./src/orchestrator/analysis-orchestrator');

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/analysis', async (req, res) => {
  try {
    const { customerId, amount, currency, merchantId } = req.body || {};
    if (!customerId || typeof amount !== 'number') {
      return res.status(400).json({ error: 'customerId (string) and amount (number) are required' });
    }
    const out = await processOrderAnalysis({ customerId, amount, currency, merchantId });
    res.json(out);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});
 
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`[app] listening on :${port}`));