# Frontend Deployment Guide

## Overview

This document provides comprehensive information about deploying the Expense Tracker frontend application to production using the automated CI/CD pipeline.

## Deployment Architecture

The deployment process is fully automated through GitHub Actions and supports multiple deployment strategies:

1. **GitHub Pages** - Static hosting via GitHub
2. **Vercel** - Serverless platform deployment
3. **Netlify** - JAMstack platform deployment
4. **Custom Server via SSH** - Deploy to your own VPS/dedicated server using Docker
5. **Docker Compose** - Orchestrated deployment with multiple services

## Automated Deployment Process

### Pipeline Flow

```
Push to master → CI Checks → Build Docker Image → Deploy to Production → Verify Deployment
```

### Deployment Trigger

Deployments are automatically triggered when:
- Code is pushed to the `master` branch
- All CI checks pass (linting, tests, type checking, build)
- Docker image is successfully built and pushed

### Deployment Steps

1. **Pre-Deployment Validation**
   - Linting and formatting checks pass
   - All unit and integration tests pass
   - TypeScript type checking succeeds
   - Application builds successfully
   - Docker image builds and passes health check

2. **Build Production Assets**
   - Environment variables are injected securely
   - Vite builds optimized production bundle
   - Sentry source maps are uploaded (if configured)

3. **Deploy to Target Environment**
   - Chosen deployment method executes
   - Zero-downtime deployment strategy
   - Old containers/builds are gracefully replaced

4. **Post-Deployment**
   - Deployment summary is generated
   - Notifications are sent (if configured)
   - Monitoring systems are updated

## Deployment Options

### Option 1: GitHub Pages

**Best for:** Simple static hosting, documentation sites, demo projects

**Setup:**

1. Uncomment the GitHub Pages deployment section in `.github/workflows/ci.yml`
2. Enable GitHub Pages in repository settings:
   - Go to `Settings → Pages`
   - Select source: `gh-pages` branch
   - Optionally configure custom domain

3. No additional secrets required (uses `GITHUB_TOKEN` automatically)

**Configuration:**

```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  if: github.ref == 'refs/heads/master'
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
    cname: your-domain.com  # Optional: add your custom domain
```

**Deployment URL:** `https://username.github.io/repository-name/`

---

### Option 2: Vercel

**Best for:** Modern web applications, serverless deployment, preview deployments

**Setup:**

1. Create a Vercel account and project
2. Install Vercel CLI: `npm i -g vercel`
3. Link your project: `vercel link`
4. Get deployment tokens:
   ```bash
   vercel login
   vercel --token # Get token
   ```

5. Add GitHub secrets:
   - `VERCEL_TOKEN` - Your Vercel authentication token
   - `VERCEL_ORG_ID` - Found in `.vercel/project.json`
   - `VERCEL_PROJECT_ID` - Found in `.vercel/project.json`

6. Uncomment Vercel deployment section in workflow

**Configuration:**

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel-args: '--prod'
```

**Features:**
- Automatic HTTPS
- Global CDN
- Instant rollbacks
- Preview deployments for PRs

---

### Option 3: Netlify

**Best for:** Static sites, JAMstack applications, form handling

**Setup:**

1. Create a Netlify account and site
2. Get deployment credentials:
   - Go to `User Settings → Applications → Personal access tokens`
   - Create new token

3. Get Site ID:
   - Go to `Site Settings → General → Site details → API ID`

4. Add GitHub secrets:
   - `NETLIFY_AUTH_TOKEN` - Your personal access token
   - `NETLIFY_SITE_ID` - Your site's API ID

5. Uncomment Netlify deployment section in workflow

**Configuration:**

```yaml
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@v2
  with:
    publish-dir: './dist'
    production-branch: master
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deploy-message: "Deploy from GitHub Actions"
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

**Features:**
- Instant cache invalidation
- Split testing
- Form handling
- Serverless functions

---

### Option 4: Custom Server (Docker via SSH)

**Best for:** Full control, custom infrastructure, multi-service deployments

**Setup:**

1. **Prepare your server:**
   ```bash
   # Install Docker and Docker Compose
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Generate SSH key for deployment:**
   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/deploy_key -N ""
   ```

3. **Add public key to server:**
   ```bash
   cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

4. **Add GitHub secrets:**
   - `DEPLOY_HOST` - Server IP or hostname (e.g., `192.168.1.100`)
   - `DEPLOY_USER` - SSH username (e.g., `ubuntu`, `deploy`)
   - `DEPLOY_SSH_KEY` - Private SSH key content (from `deploy_key`)
   - `DEPLOY_PORT` - SSH port (default: `22`)
   - `DEPLOY_PATH` - Deployment directory (e.g., `/var/www/expense-tracker`)
   - `DEPLOY_CONTAINER_PORT` - Port to expose container (e.g., `8080`)

5. **Create deployment directory on server:**
   ```bash
   sudo mkdir -p /var/www/expense-tracker
   sudo chown $USER:$USER /var/www/expense-tracker
   cd /var/www/expense-tracker
   git clone https://github.com/yourusername/expense-tracker-frontend.git .
   ```

6. **Set up nginx reverse proxy (optional):**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/expense-tracker
   ```

   Nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/expense-tracker /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Set up SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

**Deployment Flow:**
1. GitHub Actions connects to server via SSH
2. Pulls latest Docker image from GitHub Container Registry
3. Stops old container gracefully
4. Starts new container with updated image
5. Cleans up unused images

---

### Option 5: Docker Compose Deployment

**Best for:** Multi-container applications, coordinated service updates

**Setup:**

1. Follow steps 1-6 from Option 4 (Custom Server setup)

2. Add additional secret:
   - `USE_DOCKER_COMPOSE` - Set to `true`

3. **Create docker-compose.production.yml on server:**
   ```bash
   cd /var/www/expense-tracker
   nano docker-compose.production.yml
   ```

   Content:
   ```yaml
   version: '3.8'
   
   services:
     frontend:
       image: ghcr.io/yourusername/expense-tracker-frontend:latest
       container_name: expense-tracker-frontend
       restart: unless-stopped
       ports:
         - "8080:80"
       environment:
         - VITE_API_BASE_URL=${VITE_API_BASE_URL}
         - VITE_SENTRY_DSN=${VITE_SENTRY_DSN}
         - VITE_SENTRY_ENABLED=${VITE_SENTRY_ENABLED}
       healthcheck:
         test: ["CMD", "wget", "-q", "--spider", "http://localhost:80/health"]
         interval: 30s
         timeout: 10s
         retries: 3
         start_period: 40s
       networks:
         - app-network
   
     # Optional: Add nginx as reverse proxy
     nginx:
       image: nginx:alpine
       container_name: expense-tracker-nginx
       restart: unless-stopped
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf:ro
         - ./ssl:/etc/nginx/ssl:ro
       depends_on:
         - frontend
       networks:
         - app-network
   
   networks:
     app-network:
       driver: bridge
   ```

4. **Deploy using Docker Compose:**
   ```bash
   docker-compose -f docker-compose.production.yml up -d
   ```

**Features:**
- Zero-downtime deployments
- Service dependency management
- Automatic container restart
- Health check monitoring

---

## Environment Variables Management

### Required Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API URL | `https://api.example.com` | ✅ Yes |
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking | `https://...@sentry.io/...` | ❌ No |
| `VITE_SENTRY_ENABLED` | Enable Sentry tracking | `true` or `false` | ❌ No |
| `VITE_APP_VERSION` | Application version | Auto-set from commit SHA | ❌ No |

### Deployment-Specific Secrets

**For Custom Server:**
- `DEPLOY_HOST` - Server IP/hostname
- `DEPLOY_USER` - SSH username
- `DEPLOY_SSH_KEY` - SSH private key
- `DEPLOY_PORT` - SSH port (default: 22)
- `DEPLOY_PATH` - Deployment directory path
- `DEPLOY_CONTAINER_PORT` - Container exposure port

**For Vercel:**
- `VERCEL_TOKEN` - Authentication token
- `VERCEL_ORG_ID` - Organization ID
- `VERCEL_PROJECT_ID` - Project ID

**For Netlify:**
- `NETLIFY_AUTH_TOKEN` - Personal access token
- `NETLIFY_SITE_ID` - Site ID

### Adding Secrets to GitHub

1. Go to repository `Settings → Secrets and variables → Actions`
2. Click `New repository secret`
3. Add secret name and value
4. Click `Add secret`

**Security Best Practices:**
- Never commit secrets to version control
- Rotate secrets regularly
- Use environment-specific secrets
- Limit secret access to necessary workflows
- Use GitHub Environments for additional protection

---

## GitHub Environments

For enhanced security and control, configure GitHub Environments:

1. Go to `Settings → Environments`
2. Create `production` environment
3. Add protection rules:
   - ✅ Required reviewers (1-6 people)
   - ✅ Wait timer (e.g., 5 minutes)
   - ✅ Restrict to specific branches (master only)

4. Add environment-specific secrets
5. Configure environment URL for easy access

---

## Monitoring and Rollback

### Health Checks

The deployment includes automated health checks:
```bash
curl -f http://your-domain.com/health
```

Expected response: `200 OK` with "healthy" message

### Monitoring Tools

**Sentry Integration:**
- Error tracking and performance monitoring
- Real-time alerts for production issues
- Source maps for better debugging

**Server Monitoring:**
```bash
# Check container status
docker ps

# View container logs
docker logs expense-tracker-frontend

# Check resource usage
docker stats expense-tracker-frontend
```

### Rollback Procedures

**Docker Deployment Rollback:**
```bash
# SSH into server
ssh user@server

# List available images
docker images

# Stop current container
docker stop expense-tracker-frontend
docker rm expense-tracker-frontend

# Run previous version
docker run -d \
  --name expense-tracker-frontend \
  --restart unless-stopped \
  -p 8080:80 \
  ghcr.io/username/expense-tracker-frontend:previous-sha
```

**Quick Rollback via GitHub:**
1. Revert the commit that caused issues
2. Push to master
3. CI/CD will automatically deploy the reverted version

---

## Troubleshooting

### Common Issues

**Issue: Deployment fails with SSH connection timeout**
```bash
# Solution: Check firewall rules
sudo ufw allow 22/tcp
sudo ufw reload

# Test SSH connection
ssh -vvv user@server
```

**Issue: Container fails to start**
```bash
# Check logs
docker logs expense-tracker-frontend

# Check environment variables
docker inspect expense-tracker-frontend

# Verify image exists
docker images | grep expense-tracker
```

**Issue: Application not accessible**
```bash
# Check if container is running
docker ps

# Check port binding
netstat -tulpn | grep 8080

# Check nginx status
sudo systemctl status nginx
```

**Issue: Environment variables not loading**
```bash
# Verify secrets in GitHub Actions
# Check .env file on server
cat /var/www/expense-tracker/.env.production

# Rebuild with correct env vars
docker-compose down
docker-compose up -d --build
```

---

## Performance Optimization

### CDN Configuration

For static assets, consider using a CDN:

**Cloudflare Setup:**
1. Add your domain to Cloudflare
2. Update DNS records
3. Enable Auto Minify for JS/CSS/HTML
4. Enable Brotli compression
5. Set up page rules for caching

**Nginx Caching:**
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Docker Optimization

**Multi-stage builds** (already implemented):
- Separate build and runtime environments
- Minimize final image size (~40MB)
- Exclude development dependencies

**Resource limits:**
```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing locally
- [ ] Environment variables configured
- [ ] Secrets added to GitHub
- [ ] DNS records configured (if applicable)
- [ ] SSL certificates ready (if applicable)
- [ ] Backup current production (if updating)

### During Deployment
- [ ] Monitor GitHub Actions workflow
- [ ] Check deployment logs
- [ ] Verify health check passes
- [ ] Test critical user flows

### Post-Deployment
- [ ] Verify application is accessible
- [ ] Check Sentry for errors
- [ ] Monitor server resources
- [ ] Test authentication flow
- [ ] Test API connections
- [ ] Update documentation
- [ ] Notify team of deployment

---

## Continuous Improvement

### Deployment Metrics to Track

1. **Deployment Frequency**: How often are you deploying?
2. **Deployment Duration**: How long does a deployment take?
3. **Failure Rate**: What percentage of deployments fail?
4. **Rollback Rate**: How often do you need to rollback?
5. **Time to Recovery**: How long to fix failed deployments?

### Recommended Enhancements

1. **Blue-Green Deployment**: Zero-downtime deployments
2. **Canary Releases**: Gradual rollout to subset of users
3. **Feature Flags**: Toggle features without redeployment
4. **Automated Smoke Tests**: Post-deployment verification
5. **Performance Monitoring**: Track Core Web Vitals

---

## Support and Resources

### Documentation
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Sentry Documentation](https://docs.sentry.io/)

### Getting Help
- Check GitHub Actions logs for detailed error messages
- Review server logs: `docker logs expense-tracker-frontend`
- Monitor Sentry for application errors
- Consult deployment-specific documentation

---

## Summary

This deployment guide provides multiple options for deploying the Expense Tracker frontend application. Choose the deployment strategy that best fits your needs:

- **GitHub Pages**: Free, simple, great for static demos
- **Vercel/Netlify**: Managed platforms, automatic HTTPS, preview deployments
- **Custom Server**: Full control, cost-effective at scale, flexible configuration
- **Docker Compose**: Multi-service orchestration, production-ready

All deployment methods are fully automated through GitHub Actions, ensuring consistent and reliable deployments with minimal manual intervention.
