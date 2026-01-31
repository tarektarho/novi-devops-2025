# =============================================================================
# DOCKERFILE BEST PRACTICES APPLIED:
# =============================================================================
# ✅ Multi-stage builds for smaller final image
# ✅ Specific version tags (no 'latest')
# ✅ Non-root user for security
# ✅ Layer caching optimization (package.json before source)
# ✅ Production-only dependencies in final image
# ✅ Health checks for container orchestration
# ✅ .dockerignore to exclude unnecessary files
# ✅ Minimal base image (Alpine Linux)
# =============================================================================

# =============================================================================
# STAGE 1: BUILD
# =============================================================================
# Purpose: Compile TypeScript and prepare production artifacts
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency manifests first (better layer caching)
# Only re-run npm install if package.json or package-lock.json changes
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
# Use npm ci for faster, more reliable installs in CI/CD
RUN npm ci --only=production=false

# Copy application source code
# This happens AFTER npm install to leverage Docker layer caching
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# =============================================================================
# STAGE 2: PRODUCTION
# =============================================================================
# Purpose: Create minimal runtime image with only production dependencies
FROM node:22-alpine

# Install dumb-init to handle PID 1 responsibilities properly
# Ensures proper signal handling and zombie process reaping
RUN apk add --no-cache dumb-init

# Create non-root user for security (principle of least privilege)
# Running as root is a security risk
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install ONLY production dependencies (no dev tools)
# This significantly reduces image size
RUN npm ci --only=production && \
    npm cache clean --force

# Copy compiled application from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership of application files to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Document exposed port (informational)
# Note: Actual port is set via PORT environment variable (Render uses 10000)
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Health check for container orchestration
# Docker/Kubernetes can automatically restart unhealthy containers
# Use PORT env var or fallback to 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/health || exit 1

# Use dumb-init as PID 1 to handle signals properly
# This ensures graceful shutdowns and prevents zombie processes
ENTRYPOINT ["dumb-init", "--"]

# Run the application as non-root user
CMD ["node", "dist/index.js"]
