function chrono() {
  const t0 = process.hrtime.bigint();
  return () => Number(process.hrtime.bigint() - t0) / 1e6; // ms
}
module.exports = { chrono };