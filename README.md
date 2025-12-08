# NOVI Status API

A simple Node.js TypeScript API with health and status endpoints, containerized with Docker and automated CI/CD using GitHub Actions.

## Features

- ✅ TypeScript with strict type checking
- ✅ Express.js REST API
- ✅ Health and status endpoints
- ✅ Comprehensive test coverage with Jest
- ✅ Docker and Docker Compose support
- ✅ GitHub Actions CI/CD pipeline
- ✅ Multi-stage Docker builds for optimization

## Prerequisites

- Node.js 18.x or 20.x
- Docker and Docker Compose
- npm or yarn

## Installation

### Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Docker

### Build and Run with Docker

```bash
# Build Docker image
docker build -t novi-status-api .

# Run container
docker run -p 3000:3000 novi-status-api
```

### Using Docker Compose

```bash
# Start the application
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop the application
docker-compose down

# Rebuild and start
docker-compose up --build
```

## API Endpoints

### Root Endpoint
```
GET /
```
Returns welcome message and available endpoints.

**Response:**
```json
{
  "message": "Welcome to NOVI Status API",
  "endpoints": {
    "health": "/health",
    "status": "/status"
  }
}
```

### Health Check
```
GET /health
```
Returns health status, uptime, and environment information.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-08T12:00:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

### Status
```
GET /status
```
Returns service status and version information.

**Response:**
```json
{
  "service": "novi-status-api",
  "status": "running",
  "version": "1.0.0",
  "timestamp": "2025-12-08T12:00:00.000Z"
}
```

## CI/CD Pipeline

The GitHub Actions workflow automatically:

1. **Build and Test** - Runs on Node.js 18.x and 20.x
   - Installs dependencies
   - Builds TypeScript
   - Runs tests with coverage
   - Uploads coverage reports

2. **Docker Build** - Builds and tests Docker image
   - Creates Docker image
   - Tests endpoints in container

3. **Deploy** - Pushes to Docker Hub (on main branch)
   - Builds and pushes Docker image
   - Tags with latest and commit SHA

### GitHub Secrets Required

To enable deployment, add these secrets to your GitHub repository:

- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Your Docker Hub password or access token

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions workflow
├── src/
│   ├── index.ts               # Main application file
│   └── index.test.ts          # Test file
├── .dockerignore              # Docker ignore rules
├── .gitignore                 # Git ignore rules
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml         # Docker Compose configuration
├── jest.config.js             # Jest test configuration
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## Environment Variables

- `PORT` - Port number (default: 3000)
- `NODE_ENV` - Environment (development/production)

## License

ISC
