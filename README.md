# fraud-orchestrator-sim (Node.js / Express)

Simulador mínimo do orquestrador de fraude com:
- **Node 22 + Express** e `GET /health`
- **Dockerfile** multi-stage
- **docker-compose** com **LocalStack**
- **Terraform** (DynamoDB de exemplo) com provider apontando para LocalStack
- **GitHub Actions** para build/test do app e `terraform plan` via LocalStack

## Rodar localmente (sem Docker)
```bash
cd app
npm ci
npm start
# Healthcheck
curl -s http://localhost:8080/health
```

## Rodar com Docker Compose (app + LocalStack)
```bash
docker compose up --build -d
curl -s http://localhost:8080/health
```

## Terraform (LocalStack)
```bash
cd infra
terraform init -backend=false
terraform validate
terraform plan -var="aws_endpoint=http://localhost:4566"
```

## Estrutura
```
fraud-orchestrator-sim-js/
  app/                       # Node/Express app
  infra/                     # Terraform apontando para LocalStack
  .github/workflows/         # CI (app + terraform)
  docker-compose.yml
```
