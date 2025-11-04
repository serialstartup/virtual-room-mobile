# syntax=docker/dockerfile:1

FROM node:18-alpine as base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy all source files
COPY . .

# Production image, copy all the files and run expo
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expo

# Copy the application files
COPY --from=builder --chown=expo:nodejs /app ./
COPY --from=deps --chown=expo:nodejs /app/node_modules ./node_modules

USER expo

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "run", "web"]
