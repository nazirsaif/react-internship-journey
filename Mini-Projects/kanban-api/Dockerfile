# Stage 1: Install dependencies
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Copy dependencies and application from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3001

CMD ["npm", "start"]
