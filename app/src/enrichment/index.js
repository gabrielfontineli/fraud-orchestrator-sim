// contrato simples para "enrichments"
class Enrichment {
  constructor(alias) { this.alias = alias; }
  async process(_request) { throw new Error('not implemented'); }
}
module.exports = { Enrichment };