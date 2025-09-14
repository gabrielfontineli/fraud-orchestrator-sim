const express = require('express');
const { createDynamoClient } = require('./src/aws');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});


app.get('/diag/dynamodb', async (_req, res) => {
  try {
    const client = createDynamoClient();

    const out = await client.listTables({});
    res.json({ ok: true, tables: out.TableNames || [] });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.listen(port, () => {
  console.log(`[app] listening on :${port}`);
});

module.exports = app;
