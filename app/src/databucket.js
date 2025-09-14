class DataBucket {
  constructor(initial = {}) { this.map = { ...initial }; }
  set(key, value) { this.map[key] = value; return this; }
  get(key) { return this.map[key]; }
  toJSON() { return { ...this.map }; }
}
module.exports = { DataBucket };