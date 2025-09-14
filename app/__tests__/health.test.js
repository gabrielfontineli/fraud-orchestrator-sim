const request = require('supertest');
const app = require('../server');

describe('GET /health', () => {
  it('returns 200 and status ok', async () => {
    await request(app)
      .get('/health')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        if (res.body.st.atus !== 'ok') throw new Error('status not ok');
      });
  });
});
