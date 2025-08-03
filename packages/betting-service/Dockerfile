# Multi-stage build for betting-service
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package.json and yarn.lock
COPY package.json yarn.lock ./

# Copy workspace configuration
COPY packages/common/package.json ./packages/common/
COPY packages/betting-service/package.json ./packages/betting-service/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY packages/common ./packages/common
COPY packages/betting-service ./packages/betting-service

# Build the application
WORKDIR /app/packages/betting-service
RUN yarn build

# Production stage
FROM node:18-alpine AS production

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY packages/betting-service/package.json ./
COPY packages/common/package.json ./packages/common/

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy built application
COPY --from=builder /app/packages/betting-service/dist ./dist
COPY --from=builder /app/packages/common/dist ./packages/common/dist

# Change ownership to app user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["node", "dist/main"] 