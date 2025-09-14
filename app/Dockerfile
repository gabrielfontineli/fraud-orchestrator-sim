# syntax=docker/dockerfile:1

# 1) Dependências (prod)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# 2) Build da imagem (código + node_modules)
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Copia todo o app (inclui server.js, src/ e scripts/)
COPY . .

# 3) Runtime enxuto
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8080
COPY --from=build /app ./

EXPOSE 8080
# Para o serviço "app" (no docker-compose), o CMD é só o server:
CMD ["node", "server.js"]