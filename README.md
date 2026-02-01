# NOVI DevOps 2025 - REST API

A modern, production-ready Node.js TypeScript REST API built with Object-Oriented Programming principles, featuring comprehensive monitoring, testing, and containerization. This project demonstrates enterprise-level architecture with SOLID principles, Repository Pattern, and complete CI/CD automation.

## ✨ Key Features

### Architecture & Design
- 🏗️ **Object-Oriented Architecture** - SOLID principles with clean code practices
- 🔄 **Repository Pattern** - Abstracted data access layer ready for database migration
- 💉 **Dependency Injection** - Loosely coupled components for easy testing
- 🎯 **Design Patterns** - Singleton, Template, Factory, and Repository patterns
- 📝 **Full TypeScript** - Strict type checking with isolated modules

### API & Functionality
- 🚀 **RESTful CRUD API** - Complete items management with validation
- ❤️ **Health Monitoring** - Production-ready health check endpoints
- 📊 **Prometheus Metrics** - Built-in metrics collection and export
- 📈 **Grafana Integration** - Real-time monitoring and visualization
- 🔍 **Request Logging** - Structured logging with development mode

### Quality & Testing
- ✅ **95.85% Test Coverage** - 207 comprehensive tests
- 🧪 **Jest Testing** - Unit and integration tests
- 🔒 **Security Scanning** - Automated vulnerability scanning with Trivy
- 📦 **Linting** - Code quality enforcement

### DevOps & Deployment
- 🐳 **Docker** - Multi-stage builds for optimized images
- 🎼 **Docker Compose** - One-command deployment with Prometheus + Grafana
- ⚙️ **CI/CD Pipeline** - Automated testing, building, and deployment
- 🔐 **Container Security** - SARIF security reports in GitHub

## 📋 Prerequisites

- **Node.js** 22.x or higher
- **Docker** 20.x or higher
- **Docker Compose** v2.x
- **npm** 9.x or higher

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/tarektarho/novi-devops-2025.git
cd novi-devops-2025

# Install dependencies
npm install

# Run in development mode (with hot reload)
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start
```

The API will be available at `http://localhost:3000`

### Docker (Recommended)

```bash
# Start all services (API + Prometheus + Grafana)
npm run compose:up

# View logs
npm run compose:logs

# Stop all services
npm run compose:down
```

**Services:**
- API: `http://localhost:3000`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001` (admin/admin)

## 📚 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with ts-node and hot reload |
| `npm run build` | Compile TypeScript to JavaScript (output: dist/) |
| `npm start` | Run production build from dist/ |
| `npm test` | Run all Jest tests (207 tests) |
| `npm run test:watch` | Run tests in watch mode for TDD |
| `npm run test:coverage` | Generate detailed coverage report (95.85%) |
| `npm run clean` | Remove node_modules, dist, and coverage |
| `npm run ci` | Full CI pipeline: clean, install, build, docker build |
| `npm run docker:build` | Build Docker image: novi-devops-2025:latest |
| `npm run docker:run` | Run Docker container on port 3000 |
| `npm run docker:stop` | Stop and remove Docker container |
| `npm run compose:up` | Start all services with Docker Compose |
| `npm run compose:down` | Stop all Docker Compose services |
| `npm run compose:logs` | Stream logs from all services |

## 🔌 API Endpoints

### Health & Info

#### Root Endpoint
```http
GET /
```
Returns welcome message with API version and environment.

**Response:**
```json
{
  "message": "Welcome to NOVI DevOps 2025 API",
  "version": "1.0.0",
  "environment": "development"
}
```

#### Health Check
```http
GET /health
```
Returns application health status and uptime.

**Response:**
```json
{
  "status": "healthy",
  "uptime": 12345.67,
  "timestamp": "2026-01-29T10:30:00.000Z"
}
```

#### Info Endpoint
```http
GET /api/info
```
Returns detailed application information.

**Response:**
```json
{
  "name": "novi-devops-2025",
  "version": "1.0.0",
  "environment": "development",
  "nodeVersion": "22.0.0",
  "uptime": 12345.67
}
```

### Items CRUD API

#### Get All Items
```http
GET /api/items
```

#### Get Item by ID
```http
GET /api/items/:id
```

#### Create New Item
```http
POST /api/items
Content-Type: application/json

{
  "name": "Item Name",
  "description": "Optional description"
}
```

#### Update Item
```http
PUT /api/items/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### Delete Item
```http
DELETE /api/items/:id
```

### Monitoring

#### Prometheus Metrics
```http
GET /metrics
```
Returns Prometheus-formatted metrics including:
- HTTP request counters
- Response time histograms
- Process uptime
- Memory usage
- Default Node.js metrics
## 🧪 Testing

This project has comprehensive test coverage with **207 tests** achieving **95.85% code coverage**.

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for TDD
npm run test:watch

# Generate detailed coverage report
npm run test:coverage
```

### Test Structure

- **Unit Tests** (7 test suites, 151 tests)
  - ConfigService (17 tests)
  - MetricsService (18 tests)
  - Middleware (20 tests)
  - Controllers (96 tests)

- **Integration Tests** (2 test suites, 56 tests)
  - API endpoints (17 tests)
  - Repository layer (36 tests)

### Coverage Report

```
All files:        95.85% statements | 94.91% branches | 93.84% functions
Controllers:      100% coverage
Services:         100% coverage
Repositories:     100% coverage
Middleware:       100% coverage
Routes:           100% coverage
```

See [TESTING.md](TESTING.md) for detailed testing documentation.

## 🏗️ Architecture

This project follows **SOLID principles** and uses modern design patterns:

### Design Patterns
- **Singleton Pattern** - ConfigService, MetricsService, InMemoryItemsRepository
- **Repository Pattern** - Abstracted data access layer
- **Template Pattern** - BaseController, BaseMiddleware
- **Dependency Injection** - Loosely coupled components
- **Factory Pattern** - Centralized route configuration

### Project Structure

```
src/
├── app.ts                          # Main application class
├── index.ts                        # Entry point
├── config/
│   └── app.config.ts              # Configuration service (Singleton)
├── controllers/
│   ├── base.controller.ts         # Abstract base controller
│   ├── health.controller.ts       # Health & info endpoints
│   ├── items.controller.ts        # Items CRUD (uses Repository)
│   └── metrics.controller.ts      # Prometheus metrics
├── database/
│   ├── interfaces/
│   │   └── item.interface.ts      # Domain models & DTOs
│   └── repositories/
│       ├── items.repository.ts    # Abstract repository
│       └── in-memory-items.repository.ts  # In-memory implementation
├── middleware/
│   └── index.ts                   # Metrics, Error, Logger middleware
├── routes/
│   └── index.ts                   # Centralized routing
├── services/
│   └── metrics.service.ts         # Prometheus metrics service
└── tests/
    ├── api.test.ts                # Integration tests
    ├── data.test.ts               # Repository tests
    └── unit/                      # Unit tests for all modules
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

## 🐳 Docker & Containerization

### Multi-Stage Docker Build

The Dockerfile uses multi-stage builds for optimal image size:

1. **Build Stage** - Compiles TypeScript
2. **Production Stage** - Minimal runtime with only production dependencies

```bash
# Build Docker image
npm run docker:build

# Run container
npm run docker:run

# Stop container
npm run docker:stop
```

### Docker Compose Stack

The application includes a complete monitoring stack:

```yaml
services:
  app:              # Node.js API (port 3000)
  prometheus:       # Metrics collection (port 9090)
  grafana:          # Visualization (port 3001)
```

Configuration files:
- `docker-compose.yml` - Service orchestration
- `prometheus/prometheus.yml` - Scrape configuration
- `Dockerfile` - Multi-stage build definition
## ⚙️ CI/CD Pipeline

Automated GitHub Actions workflow triggered on push to `main`/`develop` branches and pull requests.

### Pipeline Flow

```
┌─────────────────────────────────────────┐
│  Parallel Quality Checks                │
│  ├─ Lint (ESLint)                       │
│  ├─ Test (Jest + Coverage)              │
│  └─ Security Audit (npm audit)          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Build & Push Docker Image              │
│  ├─ Multi-stage build                   │
│  ├─ GitHub Container Registry           │
│  └─ Layer caching for speed             │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Container Security Scan                │
│  ├─ Trivy vulnerability scanner         │
│  ├─ SARIF report upload                 │
│  └─ GitHub Security tab integration     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Deploy (Branch-specific)               │
│  ├─ Staging (develop branch)            │
│  └─ Production (main branch)            │
└─────────────────────────────────────────┘
```

### Pipeline Features

- ✅ **Parallel Execution** - Lint, test, and security checks run simultaneously
- ✅ **Docker Caching** - GitHub Actions cache for faster builds
- ✅ **Security Scanning** - Trivy scans for vulnerabilities
- ✅ **SARIF Reports** - Security findings in GitHub Security tab
- ✅ **Branch-Based Deploy** - Automatic deployment based on branch
- ✅ **Artifact Upload** - Test coverage and audit reports preserved

### Workflow Jobs

1. **lint** - Code quality checks with ESLint
2. **test** - Run 207 tests with coverage reporting
3. **security-audit** - npm audit for dependency vulnerabilities
4. **build** - Build and push Docker image to ghcr.io
5. **container-scan** - Scan Docker image with Trivy
6. **deploy-staging** - Deploy to staging (develop branch)
7. **deploy-production** - Deploy to production (main branch)

See [.github/workflows/main.yml](.github/workflows/main.yml) for complete workflow configuration.

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server listening port |
| `NODE_ENV` | `development` | Environment mode (`development`/`staging`/`production`/`test`) |
| `APP_VERSION` | Auto-detected | Application version (automatically read from package.json) |

### TypeScript Configuration

- **Target:** ES2020
- **Module:** Node16 with isolated modules
- **Strict Mode:** Enabled for maximum type safety
- **Source Maps:** Enabled for debugging
- **Output:** `dist/` directory

### Docker Configuration

- **Base Image:** `node:22-alpine` (minimal footprint)
- **Multi-stage Build:** Separate build and production stages
- **Port:** 3000 (configurable via PORT env var)
- **Health Check:** `/health` endpoint checked every 30s
- **Non-root User:** Runs as `node` user for security


## 🛡️ Security & Best Practices

### Security Features

- ✅ **Multi-stage Docker Builds** - Minimal attack surface with production-only dependencies
- ✅ **Non-root Container User** - Runs as unprivileged `node` user
- ✅ **Dependency Scanning** - Automated npm audit in CI/CD pipeline
- ✅ **Container Scanning** - Trivy vulnerability scanning for Docker images
- ✅ **SARIF Reports** - Security findings integrated in GitHub Security tab
- ✅ **TypeScript Strict Mode** - Compile-time safety and type checking
- ✅ **Input Validation** - Request validation in all API endpoints

### Code Quality

- 📊 **95.85% Test Coverage** - Comprehensive test suite
- 🎯 **SOLID Principles** - Maintainable and extensible architecture
- 🏗️ **Design Patterns** - Industry-standard patterns for common problems
- 📝 **TypeScript** - Full type safety with strict mode
- 🔍 **ESLint** - Automated code quality checks
- 📚 **Documentation** - Comprehensive docs in ARCHITECTURE.md and TESTING.md

### Production Readiness

- ❤️ **Health Checks** - Docker health check and dedicated `/health` endpoint
- 📊 **Metrics** - Prometheus metrics for monitoring
- 📈 **Observability** - Grafana dashboards for visualization
- 🔄 **Graceful Shutdown** - Proper cleanup on SIGTERM/SIGINT
- 🚨 **Error Handling** - Centralized error handling middleware
- 📝 **Structured Logging** - Request logging in development mode

## 📊 Monitoring & Observability

### Prometheus Metrics

Available at `/metrics` endpoint:

- **HTTP Metrics**
  - `http_requests_total` - Total HTTP requests by method, endpoint, and status
  - Request duration histograms
  - Response size metrics

- **System Metrics**
  - `process_uptime_seconds` - Application uptime
  - Memory usage (heap, RSS)
  - CPU usage
  - Event loop lag

### Grafana Dashboards

Access Grafana at `http://localhost:3001` (default: admin/admin)

Pre-configured to visualize:
- Request rate and latency
- Error rates
- System resource usage
- API endpoint performance

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=8080 npm start
```

#### Docker Build Fails
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t novi-devops-2025:latest .
```

#### Tests Failing
```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- src/tests/api.test.ts
```

#### Docker Compose Issues
```bash
# View service logs
npm run compose:logs

# Restart services
npm run compose:down
npm run compose:up

# Check service health
docker-compose ps
```

## 🔄 Migration to Real Database

The application uses Repository Pattern, making database migration straightforward:

### PostgreSQL Example

1. Install dependencies:
```bash
npm install pg @types/pg
```

2. Create `PostgreSQLItemsRepository`:
```typescript
export class PostgreSQLItemsRepository extends ItemsRepository {
  // Implement abstract methods using pg library
}
```

3. Update controller injection:
```typescript
const repository = new PostgreSQLItemsRepository();
const controller = new ItemsController(repository);
```

No changes needed to business logic or API endpoints!

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed architecture and design patterns
- **[TESTING.md](TESTING.md)** - Testing strategy and coverage details
- **[.github/workflows/main.yml](.github/workflows/main.yml)** - CI/CD pipeline configuration

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and test
npm run test:watch

# Check code quality
npm run lint

# Build to verify
npm run build

# Commit and push
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

## 📝 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## 👥 Authors & Contact

**Repository:** [novi-devops-2025](https://github.com/tarektarho/novi-devops-2025)
**Issues:** [Report a bug or request a feature](https://github.com/tarektarho/novi-devops-2025/issues)
**Discussions:** [Join the discussion](https://github.com/tarektarho/novi-devops-2025/discussions)

## 🙏 Acknowledgments

Built with modern tools and best practices:
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - JavaScript with syntax for types
- **Jest** - Delightful JavaScript testing
- **Prometheus** - Monitoring and alerting toolkit
- **Grafana** - Analytics and monitoring platform
- **Docker** - Containerization platform
- **GitHub Actions** - CI/CD automation

---

**Built with ❤️ using TypeScript, Express, Docker, and GitHub Actions**

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" />
</p>
