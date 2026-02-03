# Project Architecture

Object-Oriented architecture following SOLID principles, clean code practices, and modern design patterns.

## 📁 Project Structure

```
src/
├── app.ts                          # Main Application class
├── index.ts                        # Entry point
├── config/
│   └── app.config.ts              # Configuration service (Singleton)
├── controllers/
│   ├── base.controller.ts         # Abstract base controller
│   ├── health.controller.ts       # Health & info endpoints
│   ├── items.controller.ts        # Items CRUD operations
│   └── metrics.controller.ts      # Prometheus metrics
├── database/                       # Data access layer (Repository Pattern)
│   ├── index.ts                   # Barrel exports
│   ├── interfaces/
│   │   └── item.interface.ts      # Item domain interfaces
│   └── repositories/
│       ├── items.repository.ts    # Abstract repository interface
│       └── in-memory-items.repository.ts  # In-memory implementation
├── middleware/
│   └── index.ts                   # Middleware classes
├── routes/
│   └── index.ts                   # Centralized route configuration
├── services/
│   └── metrics.service.ts         # Metrics collection service
└── tests/
    ├── api.test.ts                # API integration tests
    ├── data.test.ts               # Repository unit tests
    └── unit/                      # Unit tests for all modules
```

## 🏗️ Architecture Principles

### SOLID Principles Applied

1. **Single Responsibility Principle (SRP)**
   - Each class has one clear purpose
   - `ConfigService`: Manages configuration
   - `MetricsService`: Handles Prometheus metrics
   - `ItemsController`: Manages items CRUD operations
   - `HealthController`: Handles health checks

2. **Open/Closed Principle (OCP)**
   - Base classes can be extended without modification
   - `BaseController` provides common response methods
   - `BaseMiddleware` defines template for middleware
   - Easy to add new controllers or middleware

3. **Liskov Substitution Principle (LSP)**
   - All controllers extend `BaseController`
   - All middleware extend `BaseMiddleware`
   - Can substitute any derived class for base class

4. **Interface Segregation Principle (ISP)**
   - Interfaces are focused and specific
   - `Item`, `CreateItemData`, `UpdateItemData`
   - Controllers only expose needed methods

5. **Dependency Inversion Principle (DIP)**
   - High-level modules don't depend on low-level modules
   - Controllers depend on services/abstractions
   - Dependency injection used throughout

## 🎯 Design Patterns

### 1. Singleton Pattern
- `ConfigService.getInstance()`
- `MetricsService.getInstance()`
- `InMemoryItemsRepository.getInstance()`
- Ensures single instance of configuration, metrics, and data store

### 2. Repository Pattern
- `ItemsRepository`: Abstract interface for data access
- `InMemoryItemsRepository`: In-memory implementation
- Easy to swap implementations (PostgreSQL, MongoDB, etc.)
- Separates data access from business logic

### 3. Template Pattern
- `BaseController` provides common response methods
- `BaseMiddleware` defines middleware structure

### 4. Dependency Injection
- Controllers receive repository dependencies
- Services are injected via getInstance()
- Enables easy testing with mock repositories

### 5. Factory Pattern (Implicit)
- `AppRouter` creates and configures all routes
- Centralizes route creation logic

## 📦 Main Components

### App Class (`src/app.ts`)
Main application orchestrator that:
- Initializes Express application
- Configures middleware
- Sets up routes
- Handles errors
- Starts server

### Configuration Service (`src/config/app.config.ts`)
Singleton service managing:
- Environment variables
- Application settings
- Environment detection (dev/prod/test)

### Controllers
#### Base Controller (`src/controllers/base.controller.ts`)
- `ok()`: 200 response
- `created()`: 201 response
- `fail()`: 400 error
- `notFound()`: 404 error
- `serverError()`: 500 error

#### Items Controller (`src/controllers/items.controller.ts`)
RESTful CRUD operations using Repository Pattern:
- Uses `ItemsRepository` for data access abstraction
- Supports Dependency Injection for different repository implementations
- `getAll()`: GET /api/items
- `getById()`: GET /api/items/:id
- `create()`: POST /api/items
- `update()`: PUT /api/items/:id
- `delete()`: DELETE /api/items/:id

#### Health Controller (`src/controllers/health.controller.ts`)
- `root()`: GET /
- `health()`: GET /health
- `info()`: GET /api/info

#### Metrics Controller (`src/controllers/metrics.controller.ts`)
- `getMetrics()`: GET /metrics

### Middleware
#### MetricsMiddleware
- Records HTTP request metrics
- Updates Prometheus counters

#### ErrorHandlerMiddleware
- Centralized error handling
- Logs errors
- Returns formatted error responses

#### RequestLoggerMiddleware
- Logs incoming requests (development only)

### Services
#### MetricsService
- Manages Prometheus metrics
- Collects default metrics
- Tracks HTTP requests
- Provides metrics endpoint data

### Data Access Layer (`src/database/`)
#### Repository Pattern Implementation
- **ItemsRepository** (`repositories/items.repository.ts`): Abstract base class defining data access interface
- **InMemoryItemsRepository** (`repositories/in-memory-items.repository.ts`): Singleton implementation using in-memory storage
- **Item Interfaces** (`interfaces/item.interface.ts`): Domain models and DTOs
  - `Item`: Complete item entity
  - `CreateItemData`: DTO for item creation
  - `UpdateItemData`: DTO for item updates

#### Benefits
- **Abstraction**: Controllers don't know about data source
- **Swappable**: Easy to replace with PostgreSQL, MongoDB, etc.
- **Testable**: Can inject mock repositories for testing
- **Future-proof**: Ready for database migration

### Routes (`src/routes/index.ts`)
Centralized route configuration:
- Groups related routes
- Injects controllers
- Clean route definitions

## ✨ Benefits of This Architecture

### 1. **Maintainability**
- Clear separation of concerns
- Easy to locate and modify code
- Single responsibility for each class

### 2. **Testability**
- Easy to mock dependencies
- Unit testable controllers
- Integration testable routes

### 3. **Scalability**
- Easy to add new features
- Can extend without modifying existing code
- Modular structure

### 4. **Reusability**
- Base classes provide common functionality
- Services can be shared across controllers
- Middleware can be reused

### 5. **Type Safety**
- Full TypeScript support
- Interfaces for data structures
- Compile-time error detection

## 🔄 Request Flow

```
1. Client Request
   ↓
2. Express Middleware (json parser)
   ↓
3. RequestLoggerMiddleware (dev only)
   ↓
4. MetricsMiddleware (records request)
   ↓
5. Router → Controller
   ↓
6. Controller → Service/Data Layer
   ↓
7. Controller → Response
   ↓
8. MetricsMiddleware (records response)
   ↓
9. Client Response
```

## 🧪 Testing Strategy

### Unit Tests
- Data store functions (`data.test.ts`)
- Individual controller methods
- Service methods

### Integration Tests
- Full API endpoints (`api.test.ts`)
- Request/response validation
- Error handling

## 🚀 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Testing
```bash
npm test              # Run all tests
npm test:watch        # Watch mode
npm test:coverage     # With coverage
```

### Docker
```bash
docker-compose up -d
```

## 📊 Metrics & Monitoring

- **Prometheus metrics**: `http://localhost:3000/metrics`
- **Health check**: `http://localhost:3000/health`
- **Grafana**: `http://localhost:3001`

## 🎓 Learning Resources

### SOLID Principles
- Single Responsibility: One class, one purpose
- Open/Closed: Open for extension, closed for modification
- Liskov Substitution: Subtypes must be substitutable
- Interface Segregation: Many specific interfaces
- Dependency Inversion: Depend on abstractions

### Design Patterns Used
- Singleton: Single instance management
- Template: Define skeleton of algorithm
- Dependency Injection: Invert control of dependencies

## 🔜 Future Improvements

1. **Database Migration**: Replace InMemoryItemsRepository with PostgreSQL or MongoDB
2. **Dependency Injection Container**: Add InversifyJS or tsyringe for advanced DI
3. **Validation Layer**: Implement class-validator or Joi for request validation
4. **Authentication**: Add JWT authentication and authorization middleware
5. **Rate Limiting**: Implement rate limiting middleware for API protection
6. **API Documentation**: Add Swagger/OpenAPI for interactive API docs
7. **Caching**: Implement Redis caching layer
8. **Message Queue**: Add Bull or RabbitMQ for background jobs
9. **Event System**: Implement event-driven architecture with event emitters
10. **Logging**: Enhance with Winston or Pino for structured logging
