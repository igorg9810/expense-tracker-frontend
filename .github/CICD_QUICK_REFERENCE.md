# CI/CD Pipeline Quick Reference

## 🚀 Quick Start

### First Time Setup
```bash
# 1. Enable GitHub Actions (Settings → Actions)
# 2. Add repository secrets (Settings → Secrets)
# 3. Configure branch protection (Settings → Branches)
# 4. Push workflow to repository
git add .github/
git commit -m "ci: add GitHub Actions CI/CD pipeline"
git push origin master
```

### Running the Pipeline
```bash
# Automatically runs on:
- Push to master/main/develop
- Pull request to master/main/develop

# Manual trigger (if enabled):
# Go to Actions tab → Select workflow → Run workflow
```

## 📋 Pipeline Jobs

| Job | Purpose | Duration | Runs On |
|-----|---------|----------|---------|
| **lint-and-format** | ESLint, Prettier, Stylelint | ~30s | All events |
| **test** | Jest tests + coverage | ~60s | All events |
| **type-check** | TypeScript validation | ~20s | All events |
| **build** | Vite production build | ~40s | All events |
| **docker-build** | Build & test Docker image | ~90s | All events |
| **security-scan** | npm audit + Snyk | ~30s | All events |
| **deployment-ready** | Deployment notification | ~5s | Push to master only |

## 🔑 Required Secrets

### Essential (Recommended)
```
VITE_API_BASE_URL=https://api.your-domain.com
```

### Optional (For Full Features)
```
# Sentry Error Tracking
VITE_SENTRY_DSN=https://...@sentry.io/...
VITE_SENTRY_ENABLED=true
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-token

# Code Coverage
CODECOV_TOKEN=your-codecov-token

# Security Scanning
SNYK_TOKEN=your-snyk-token
```

## 🎯 Branch Protection Rules

### Required Status Checks
- `Linting and Formatting`
- `Unit & Integration Tests`
- `TypeScript Type Checking`
- `Build Application`
- `Build Docker Image`

### Settings
- ✅ Require pull request reviews (1 approval)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Require conversation resolution

## 🐳 Docker Images

### Viewing Published Images
```bash
# Go to: https://github.com/your-username/expense-tracker-frontend/pkgs/container/expense-tracker-frontend
```

### Pulling Images
```bash
# Latest (from master)
docker pull ghcr.io/your-username/expense-tracker-frontend:latest

# Specific branch
docker pull ghcr.io/your-username/expense-tracker-frontend:develop

# Specific commit
docker pull ghcr.io/your-username/expense-tracker-frontend:master-abc123

# Running locally
docker run -p 8080:80 ghcr.io/your-username/expense-tracker-frontend:latest
```

## 📊 Viewing Results

### Pipeline Status
```
Repository → Actions tab → Select workflow run
```

### Coverage Reports
```
Actions → Select run → Download "coverage-report" artifact
```

### Build Artifacts
```
Actions → Select run → Download "build-output" artifact
```

### Docker Images
```
Repository → Packages (right sidebar)
```

## 🔧 Common Commands

### Run Locally (Before Push)
```bash
# Check everything that CI will check
npm run lint          # ESLint
npm run stylelint     # Stylelint
npm run format -- --check  # Prettier
npm run test:coverage # Tests
npm run build        # Production build

# Docker build test
docker build --build-arg VITE_API_BASE_URL=http://localhost:3000 -t test .
```

### Fix Issues
```bash
# Auto-fix linting
npm run lint:fix
npm run stylelint:fix
npm run format

# Run specific tests
npm run test -- path/to/test.test.ts

# Debug build
npm run build -- --debug
```

## ⚠️ Troubleshooting

### Pipeline Fails on Linting
```bash
# Fix locally
npm run lint:fix
npm run format
git add .
git commit -m "fix: resolve linting issues"
git push
```

### Tests Fail in CI but Pass Locally
```bash
# Run in CI mode
CI=true npm run test

# Check for environment differences
```

### Docker Build Fails
```bash
# Test Docker build locally
docker build --build-arg VITE_API_BASE_URL=http://localhost:3000 -t test .

# Check .dockerignore
# Verify all tsconfig files are included
```

### Status Checks Don't Show on PR
1. Workflow must be on base branch (master)
2. Check workflow name matches branch protection rules
3. Verify Actions are enabled in repo settings

## 📈 Performance Tips

### Speed Up Pipeline
- ✅ Use caching (already configured)
- ✅ Run jobs in parallel (already configured)
- ✅ Use `npm ci` instead of `npm install`
- ✅ Optimize Docker layer caching

### Reduce Costs
- Limit workflow runs to specific paths (if needed)
- Use self-hosted runners for private repos
- Optimize build steps

### Monitor Usage
```
Settings → Billing → Actions
```

## 🎓 Best Practices

### Commit Messages
```bash
# Trigger CI explicitly
git commit -m "feat: add new feature"  # CI runs
git commit -m "fix: resolve bug"      # CI runs
git commit -m "docs: update README"   # CI runs

# Skip CI (if needed)
git commit -m "docs: update [skip ci]"  # CI skipped
```

### PR Workflow
1. Create feature branch
2. Make changes and commit
3. Push and create PR
4. Wait for CI to pass
5. Request review
6. Merge after approval + CI success

### Deployment Workflow
1. Merge PR to master
2. CI runs automatically
3. Docker image pushed to GHCR
4. Use image for deployment (Task 7)

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Codecov Documentation](https://docs.codecov.com/)
- [Snyk Documentation](https://docs.snyk.io/)

## 💡 Tips

- Review Actions logs for detailed error messages
- Download artifacts for local debugging
- Use workflow badges in README for visibility
- Set up notifications for failed builds
- Regularly update action versions

## 🔗 Useful Links

- **Actions**: `/actions`
- **Packages**: `/packages`
- **Settings**: `/settings`
- **Security**: `/security`
- **Insights**: `/pulse`
