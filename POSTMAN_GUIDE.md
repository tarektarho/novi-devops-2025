# Postman API Testing Guide

Postman collection for testing NOVI DevOps 2025 API endpoints across all environments.

## Files Included

- **`postman_collection.json`** - Complete API collection with all endpoints
- **`postman_environment_local.json`** - Local development environment (localhost:3000)
- **`postman_environment_staging.json`** - Staging environment (Render staging)
- **`postman_environment_production.json`** - Production environment (Render production)

---

## Quick Start

### 1. Import Collection into Postman

**Option A: Using Postman Desktop**
1. Open Postman
2. Click **Import** button (top left)
3. Select **Files** tab
4. Choose `postman_collection.json`
5. Click **Import**

**Option B: Using Postman CLI**
```bash
postman import postman_collection.json
```

### 2. Import Environments

Import all three environment files:
1. Click **Import** again
2. Select all environment files:
   - `postman_environment_local.json`
   - `postman_environment_staging.json`
   - `postman_environment_production.json`
3. Click **Import**

### 3. Select Environment

In Postman's top-right corner:
1. Click the **Environment dropdown**
2. Select the environment you want to test:
   - **NOVI DevOps 2025 - Local** (http://localhost:3000)
   - **NOVI DevOps 2025 - Staging** (https://novi-devops-2025-staging.onrender.com)
   - **NOVI DevOps 2025 - Production** (https://novi-devops-2025-prod.onrender.com)

---

## Available Endpoints

### Health & Info
- **GET /** - Welcome message and endpoint list
- **GET /health** - Health check with uptime and environment
- **GET /api/info** - Application info with version and memory usage

### Metrics
- **GET /metrics** - Prometheus metrics for monitoring

### Items CRUD
- **GET /api/items** - Get all items
- **GET /api/items/:id** - Get single item by ID
- **POST /api/items** - Create new item
- **PUT /api/items/:id** - Update existing item
- **DELETE /api/items/:id** - Delete item

---

## Testing Workflow

### 1. Test Health Endpoints First

Start by verifying the service is running:

```
1. Select environment (e.g., "Local")
2. Open "Health & Info" folder
3. Run "Health Check" → Should return 200 OK
4. Run "API Info" → Should return application details
```

### 2. Test Items CRUD Operations

Follow the CRUD flow:

```
Step 1: Get All Items
  → Returns empty array or existing items

Step 2: Create Item
  → Body: {"name": "Test Item", "description": "Test Description"}
  → Returns 201 Created with new item

Step 3: Get All Items Again
  → Should include the newly created item

Step 4: Get Item by ID
  → Use ID from created item
  → Returns 200 OK with item details

Step 5: Update Item
  → Body: {"name": "Updated Name", "description": "Updated Description"}
  → Returns 200 OK with updated item

Step 6: Delete Item
  → Returns 204 No Content

Step 7: Verify Deletion
  → Get Item by ID → Should return 404 Not Found
```

### 3. Test Error Scenarios

Verify error handling:

```
- GET /api/items/999 → 404 Not Found
- POST /api/items with missing fields → 400 Bad Request
- PUT /api/items/999 → 404 Not Found
- DELETE /api/items/999 → 404 Not Found
```

---

## Environment Variables

Each environment uses a `baseUrl` variable:

| Environment | baseUrl |
|-------------|---------|
| Local | `http://localhost:3000` |
| Staging | `https://novi-devops-2025-staging.onrender.com` |
| Production | `https://novi-devops-2025-prod.onrender.com` |

**To modify:**
1. Click **Environments** (left sidebar)
2. Select environment to edit
3. Update `baseUrl` value
4. Click **Save**

---

## Example Request Bodies

### Create Item
```json
{
    "name": "New Item",
    "description": "Description of the new item"
}
```

### Update Item
```json
{
    "name": "Updated Item Name",
    "description": "Updated description"
}
```

---

## 🎯 Pre-configured Examples

Each endpoint includes example responses:

- ✅ **Success responses** (200, 201, 204)
- ❌ **Error responses** (400, 404)
- 📝 **Sample data** for reference

These examples help you understand expected response formats before making actual requests.

---

## 🔍 Testing Against Different Environments

### Local Development
```bash
# Start local server first
npm run dev

# Or with Docker
docker-compose up

# Then test with Postman using "Local" environment
```

### Staging
```bash
# No setup needed - deployed on Render
# Just select "Staging" environment and test
```

### Production
```bash
# No setup needed - deployed on Render
# Select "Production" environment
# Be careful - this is live data!
```

---

## 🛠️ Advanced Usage

### Running Collection via Newman (CLI)

Install Newman:
```bash
npm install -g newman
```

Run entire collection:
```bash
# Local environment
newman run postman_collection.json -e postman_environment_local.json

# Staging environment
newman run postman_collection.json -e postman_environment_staging.json

# Production environment
newman run postman_collection.json -e postman_environment_production.json
```

Run specific folder:
```bash
newman run postman_collection.json \
  -e postman_environment_local.json \
  --folder "Items CRUD"
```

Generate HTML report:
```bash
newman run postman_collection.json \
  -e postman_environment_local.json \
  --reporters cli,html \
  --reporter-html-export newman-report.html
```

### Automated Testing in CI/CD

Add to GitHub Actions workflow:

```yaml
- name: API Testing with Newman
  run: |
    npm install -g newman
    newman run postman_collection.json \
      -e postman_environment_staging.json \
      --bail \
      --color on
```

---

## 📈 Monitoring Metrics

### Prometheus Metrics Endpoint

The `/metrics` endpoint returns Prometheus-formatted metrics:

```bash
# View in Postman
GET {{baseUrl}}/metrics

# Or with curl
curl http://localhost:3000/metrics
```

**Example metrics:**
- `nodejs_heap_size_total_bytes` - Total heap size
- `nodejs_heap_size_used_bytes` - Used heap size
- `nodejs_external_memory_bytes` - External memory
- `process_cpu_user_seconds_total` - CPU usage

---

## 🐛 Troubleshooting

### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```
**Solution:** Make sure the server is running locally or select the correct environment.

### 404 Not Found on All Endpoints
```
Error: Cannot GET /api/items
```
**Solution:** Check that `baseUrl` doesn't have a trailing slash.

### CORS Errors (Browser)
```
Error: CORS policy blocked
```
**Solution:** CORS is not an issue in Postman. If testing via browser, ensure CORS is enabled in the API.

### SSL Certificate Errors (Staging/Production)
```
Error: SSL certificate problem
```
**Solution:** In Postman settings, disable "SSL certificate verification" for testing only.

---

## 📚 Additional Resources

- [Postman Documentation](https://learning.postman.com/)
- [Newman Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)
- [API Documentation](../README.md)
- [GitHub Actions Guide](../.github/GITHUB_ACTIONS_GUIDE.md)

---

## ✅ Testing Checklist

Before deployment, verify:

- [ ] All health endpoints return 200 OK
- [ ] Create item returns 201 Created
- [ ] Get all items returns array
- [ ] Get item by ID returns correct item
- [ ] Update item modifies data correctly
- [ ] Delete item returns 204 No Content
- [ ] Error handling returns appropriate status codes
- [ ] Metrics endpoint returns Prometheus format

---

**Happy Testing! 🚀**
