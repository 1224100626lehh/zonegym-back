# Etapa 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Etapa 2: producción
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 5000
CMD ["node", "src/server.js"]