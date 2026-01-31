# GitHub Actions CI/CD - Setup Guide

## 🎯 Overview

Your workflow now implements **industry-standard CI/CD**:

✅ **Concurrency Control** - Cancels outdated runs automatically
✅ **Job Timeouts** - Prevents runaway jobs (saves money)
✅ **Dependency Review** - Blocks malicious packages in PRs
✅ **SBOM Generation** - Software Bill of Materials for security
✅ **Minimal Permissions** - Least privilege principle
✅ **Parallel Execution** - Faster CI (lint + test + audit simultaneously)
✅ **Supply Chain Security** - Build attestations and provenance
✅ **Smoke Tests** - Post-deployment verification
✅ **Environment URLs** - Quick access to staging/production

---

## 📋 Required Secrets Configuration

### Step 1: Get Render Deploy Hooks

**For Production:**
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your `novi-devops-2025-prod` service
3. Navigate to **Settings** → **Deploy Hook**
4. Click **Create Deploy Hook**
5. Copy the webhook URL (looks like `https://api.render.com/deploy/srv-xxx...`)

**For Staging** (if you create a staging service):
1. Create a new Render service for staging
2. Follow same steps as production
3. Copy the staging webhook URL

### Step 2: Add Secrets to GitHub

1. Go to your GitHub repository: `https://github.com/tarektarho/novi-devops-2025`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

| Secret Name | Value | Used For |
|-------------|-------|----------|
| `RENDER_DEPLOY_HOOK` | `https://api.render.com/deploy/srv-xxx...` | Production deployment |
| `STAGING_DEPLOY_HOOK` | `https://api.render.com/deploy/srv-yyy...` | Staging deployment (optional) |

**Optional Notification Secrets:**
| Secret Name | Example | Used For |
|-------------|---------|----------|
| `SLACK_WEBHOOK` | `https://hooks.slack.com/services/...` | Slack notifications |
| `DISCORD_WEBHOOK` | `https://discord.com/api/webhooks/...` | Discord notifications |

---

## 🔒 Environment Configuration

### Step 1: Create GitHub Environments

1. Go to **Settings** → **Environments**
2. Create two environments:

#### **Staging Environment**
- Name: `staging`
- Environment URL: `https://novi-devops-2025-staging.onrender.com`
- Protection rules: None (auto-deploy)

#### **Production Environment**
- Name: `production`
- Environment URL: `https://novi-devops-2025-prod.onrender.com`
- Protection rules:
  - ☑️ **Required reviewers**: Add yourself (for manual approval)
  - ☑️ **Wait timer**: 5 minutes (optional - time to cancel if needed)
  - ☑️ **Deployment branches**: Only `main` branch

### Why Environments?
- **Manual Approval**: Requires team review before production deploys
- **Environment Secrets**: Different secrets for staging vs production
- **Deployment History**: Track all deployments in one place
- **Quick Access**: Click environment URL to view live site

---

## 🚀 Workflow Behavior

### Branch Strategy

```
develop branch → Staging Environment
   ↓
Pull Request → Code Review + Tests
   ↓
main branch → Production Environment (with approval)
```

### Automatic Triggers

| Action | Triggers | Jobs Run |
|--------|----------|----------|
| Push to `develop` | Yes | lint, test, audit, build, scan, **deploy-staging** |
| Push to `main` | Yes | lint, test, audit, build, scan, **deploy-production** |
| Pull Request to `main` | Yes | lint, test, audit, dependency-review, build (no push) |
| Push to other branches | No | - |

### Concurrency Example

**Scenario:** You push 3 commits rapidly:
```
Commit A → Workflow starts
Commit B → Workflow starts, Commit A cancelled ✅
Commit C → Workflow starts, Commit B cancelled ✅
```

**Result:** Only Commit C runs (saves ~20 CI minutes)

---

## 🔍 Understanding the Jobs

### 1️⃣ **Code Quality** (Parallel)
- **lint** (10min timeout) - ESLint code quality checks
- **test** (15min timeout) - Jest test suite + coverage
- **security-audit** (10min timeout) - npm audit for vulnerabilities

### 2️⃣ **Dependency Review** (PRs Only)
- Scans for malicious packages
- Comments on PR with findings
- Fails if high/critical vulnerabilities found

### 3️⃣ **Build** (20min timeout)
- Builds Docker image
- Pushes to GitHub Container Registry (`ghcr.io`)
- Generates SBOM (Software Bill of Materials)
- Creates build attestations for supply chain security

### 4️⃣ **Security Scan** (15min timeout)
- Uses Trivy to scan Docker image
- Checks for CVEs in dependencies and OS packages
- Uploads results to GitHub Security tab

### 5️⃣ **Deploy Staging** (10min timeout)
- Triggers on `develop` branch push
- Calls Render deploy hook
- Waits 30s and verifies health endpoint
- Auto-deploys (no approval needed)

### 6️⃣ **Deploy Production** (15min timeout)
- Triggers on `main` branch push
- **Requires manual approval** (if configured)
- Calls Render deploy hook
- Waits 60s for Render to build
- Runs smoke tests:
  - `/health` endpoint (10 retries)
  - `/api/info` endpoint
  - `/api/items` endpoint
- Records deployment details

---

## 🧪 Testing Your Workflow

### Test Without Deploying

**Option 1: Create a PR**
```bash
git checkout -b test-workflow
# Make a small change
echo "# Test" >> README.md
git add README.md
git commit -m "Test: Verify CI workflow"
git push origin test-workflow
```
Then create a PR on GitHub → All checks run except deployment

**Option 2: Trigger Manually** (add to workflow)
```yaml
on:
  workflow_dispatch:  # Enables "Run workflow" button in GitHub UI
```

### Test Deployments Locally

**Trigger Render Deploy Hook Manually:**
```bash
# Production
curl -X POST "YOUR_RENDER_DEPLOY_HOOK_URL"

# Check if it worked
curl https://novi-devops-2025-prod.onrender.com/health
```

---

## 📊 Monitoring CI/CD

### GitHub Actions Tab
- View all workflow runs: `Actions` tab in repository
- Filter by branch, status, or workflow name
- Download logs and artifacts

### GitHub Security Tab
- View Trivy scan results: `Security` → `Code scanning`
- View dependency alerts: `Security` → `Dependabot`

### GitHub Insights
- Action usage: `Insights` → `Actions`
- See CI minutes used (important for billing)

---

## 💰 Cost Optimization

Your workflow is optimized to save CI minutes:

| Feature | Savings |
|---------|---------|
| Concurrency cancellation | ~60% less runs |
| Job timeouts | Prevents runaway jobs |
| npm cache | ~30s faster per job |
| Docker layer cache | ~2min faster builds |
| Parallel jobs | 3x faster than sequential |

**Free Tier Limits:**
- **GitHub Free**: 2,000 minutes/month
- **GitHub Pro**: 3,000 minutes/month

**Estimate:** With these optimizations, you can run ~100-150 full workflows/month on free tier.

---

## 🔧 Customization Options

### 1. Add Slack Notifications

Uncomment the notification step in production deploy:
```yaml
- name: Notify team
  if: always()
  run: |
    STATUS_EMOJI="${{ job.status == 'success' && '✅' || '❌' }}"
    MESSAGE="$STATUS_EMOJI Production deployment ${{ job.status }}\nCommit: ${{ github.sha }}"
    curl -X POST "${{ secrets.SLACK_WEBHOOK }}" \
      -H "Content-Type: application/json" \
      -d "{\"text\": \"$MESSAGE\"}"
```

### 2. Add More Smoke Tests

Edit the smoke tests step:
```yaml
# Test 4: Database connection
echo "Testing database connectivity..."
if curl -f -s "$BASE_URL/api/health/db" | grep -q "connected"; then
  echo "✅ Database connected"
else
  echo "❌ Database connection failed"
  exit 1
fi
```

### 3. Add Performance Tests

```yaml
- name: Run performance tests
  run: |
    echo "🏃 Running load tests..."
    npx artillery quick --count 10 --num 100 \
      https://novi-devops-2025-prod.onrender.com/api/items
```

### 4. Change Auto-Deploy Behavior

**Disable auto-deploy (manual only):**
```yaml
deploy-production:
  if: false  # Never auto-deploy
```

**Deploy only on tags:**
```yaml
on:
  push:
    tags:
      - 'v*'  # Only deploy on version tags (v1.0.0, v2.1.3, etc.)
```

---

## 🐛 Troubleshooting

### ❌ "Build failed - timeout"
**Cause:** Job exceeded timeout limit
**Solution:** Increase timeout or optimize build
```yaml
timeout-minutes: 30  # Increase from 20
```

### ❌ "Permission denied - packages: write"
**Cause:** Missing permissions for GHCR push
**Solution:** Already configured - check token hasn't expired

### ❌ "Health check failed after deployment"
**Cause:** App not listening on PORT env variable
**Solution:** Verify in your code:
```typescript
const PORT = process.env.PORT || 3000;
app.listen(PORT);
```

### ❌ "RENDER_DEPLOY_HOOK not configured"
**Cause:** Secret not added to GitHub
**Solution:** Follow "Required Secrets Configuration" section above

### ❌ "Dependency review failed"
**Cause:** PR introduces vulnerable dependencies
**Solution:**
1. Check PR comments for details
2. Update vulnerable packages
3. Push fix to PR branch

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render Deploy Hooks](https://render.com/docs/deploy-hooks)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Trivy Security Scanner](https://aquasecurity.github.io/trivy/)
- [SBOM & Supply Chain Security](https://docs.github.com/en/code-security/supply-chain-security)

---

## ✅ Checklist for Production Readiness

- [ ] Added `RENDER_DEPLOY_HOOK` secret to GitHub
- [ ] Created `production` environment with manual approval
- [ ] Updated Render service URLs in workflow (if different)
- [ ] Tested workflow with a PR
- [ ] Verified Docker image builds successfully
- [ ] Confirmed app listens on `process.env.PORT`
- [ ] Tested `/health` endpoint returns 200 OK
- [ ] Reviewed security scan results
- [ ] Set up notifications (optional)
- [ ] Documented deployment process for team

---

**Need help?** Check workflow logs in Actions tab or review [main.yml](.github/workflows/main.yml) comments.
