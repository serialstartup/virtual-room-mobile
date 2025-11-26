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

# Production image, copy all the files and run expo
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expo

# Copy the application files with proper ownership
COPY --from=builder --chown=expo:nodejs /app ./
COPY --from=deps --chown=expo:nodejs /app/node_modules ./node_modules

# Ensure expo user has write permissions for necessary directories
RUN chown -R expo:nodejs /app && \
    chmod -R 755 /app && \
    mkdir -p /app/.expo && \
    chown -R expo:nodejs /app/.expo

# Switch to expo user
USER expo

EXPOSE 3000

# Start the application
CMD ["npm", "run", "web"]

