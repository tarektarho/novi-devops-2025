# Testing Documentation

## Overview

Testing approach for novi-devops-2025. The test suite has 207 tests with 95.81% code coverage.

## Test Structure

### Test Files

The test suite is organized into the following categories:

#### Unit Tests (7 files)
1. **config.service.test.ts** - ConfigService tests (17 tests)
   - Singleton pattern validation
   - Configuration retrieval
   - Environment-based methods (isProduction, isDevelopment, isTest)
   - Environment variable handling

2. **metrics.service.test.ts** - MetricsService tests (18 tests)
   - Singleton pattern validation
   - Request recording
   - Metrics retrieval
   - Content type handling
   - Integration scenarios

3. **middleware.test.ts** - Middleware classes tests (20 tests)
   - MetricsMiddleware request recording
   - ErrorHandlerMiddleware error handling
   - RequestLoggerMiddleware logging functionality
   - Template pattern implementation

4. **base.controller.test.ts** - BaseController tests (25 tests)
   - Response methods: ok(), created(), fail(), notFound(), serverError()
   - Method chaining
   - Edge cases (empty objects, arrays, undefined)

5. **health.controller.test.ts** - HealthController tests (24 tests)
   - root() endpoint
   - health() endpoint with uptime
   - info() endpoint with environment information

6. **items.controller.test.ts** - ItemsController tests (29 tests)
   - CRUD operations: getAll(), getById(), create(), update(), delete()
   - Validation (invalid IDs, missing data)
   - Error handling
   - Integration workflow

7. **metrics.controller.test.ts** - MetricsController tests (20 tests)
   - getMetrics() endpoint
   - Prometheus format headers
   - Error scenarios
   - Service integration

#### Integration Tests (2 files)
8. **api.test.ts** - API integration tests (17 tests)
   - Health endpoints (/health, /info)
   - Metrics endpoint (/metrics)
   - RESTful CRUD endpoints (/items)
   - Request/response validation

9. **data.test.ts** - Data store tests (36 tests)
   - Data retrieval (getAll, getById)
   - Data creation
   - Data updates
   - Data deletion
   - Edge cases and error handling

## Test Statistics

```
Test Suites: 9 passed, 9 total
Tests:       1 skipped, 206 passed, 207 total
```

### Code Coverage

```
------------------------|---------|----------|---------|---------|-------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------|---------|----------|---------|---------|-------------------
All files               |   95.81 |    94.54 |      95 |   96.01 |
 src                    |   87.14 |       80 |   84.21 |   85.71 |
  app.ts                |   71.87 |       50 |      70 |   73.33 | 41,60,71-76
  data.ts               |     100 |      100 |     100 |     100 |
  index.ts              |     100 |      100 |     100 |     100 |
 src/config             |     100 |     87.5 |     100 |     100 |
  app.config.ts         |     100 |     87.5 |     100 |     100 | 19
 src/controllers        |     100 |      100 |     100 |     100 |
  base.controller.ts    |     100 |      100 |     100 |     100 |
  health.controller.ts  |     100 |      100 |     100 |     100 |
  items.controller.ts   |     100 |      100 |     100 |     100 |
  metrics.controller.ts |     100 |      100 |     100 |     100 |
 src/middleware         |     100 |      100 |     100 |     100 |
  index.ts              |     100 |      100 |     100 |     100 |
 src/routes             |     100 |      100 |     100 |     100 |
  index.ts              |     100 |      100 |     100 |     100 |
 src/services           |     100 |      100 |     100 |     100 |
  metrics.service.ts    |     100 |      100 |     100 |     100 |
------------------------|---------|----------|---------|---------|-------------------
```

## Testing Patterns

### Singleton Pattern Testing

ConfigService and MetricsService use the Singleton pattern. Tests are designed to work with the single instance:

```typescript
beforeEach(() => {
  jest.restoreAllMocks(); // Restore all mocks between tests
  service = ServiceClass.getInstance();
});
```

### Mock Response Objects

Controllers are tested using mock Express Request and Response objects:

```typescript
mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis()
};
```

### Spy Management

All spies are restored in `beforeEach` to prevent cross-test contamination:

```typescript
beforeEach(() => {
  jest.restoreAllMocks();
  // ... setup code
});
```

### Integration Testing

Integration tests use `supertest` to test the full Express application:

```typescript
import request from 'supertest';
import app from '../index';

it('should return health status', async () => {
  const response = await request(app).get('/health');
  expect(response.status).toBe(200);
});
```

## Running Tests

### All Tests
```bash
npm test
```

### With Coverage
```bash
npm test -- --coverage
```

### Specific Test File
```bash
npm test -- src/tests/unit/config.service.test.ts
```

### Watch Mode
```bash
npm test -- --watch
```

### Verbose Output
```bash
npm test -- --verbose
```

## Test Configuration

### Jest Configuration (jest.config.js)
- **Environment**: node
- **Transform**: ts-jest for TypeScript
- **Coverage**: src directory
- **Setup**: jest.setup.js for polyfills

### Important Polyfills (jest.setup.js)
- `TextEncoder` and `TextDecoder` for Node.js compatibility
- `setImmediate` and `clearImmediate` for prom-client compatibility
- `localStorage` polyfill

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on others
2. **Cleanup**: Mocks and spies are restored between tests
3. **Coverage**: Aim for >95% coverage on all modules
4. **Descriptive**: Test names clearly describe what is being tested
5. **AAA Pattern**: Arrange-Act-Assert structure
6. **Edge Cases**: Test boundary conditions and error scenarios
7. **Integration**: Test full workflows in addition to unit tests

## Known Limitations

1. **app.ts Coverage**: Server listening logic (71.87% coverage) is partially covered as it involves async server startup
2. **Skipped Test**: One API test is skipped pending implementation

## Future Improvements

- [ ] Add performance tests
- [ ] Add load testing with artillery or k6
- [ ] Add mutation testing with Stryker
- [ ] Increase app.ts coverage with more integration scenarios
- [ ] Add contract testing for API endpoints
- [ ] Add database integration tests when persistence is added
