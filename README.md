# Expense Tracker Frontend

> A modern React application for tracking personal expenses with OCR invoice scanning, drag-and-drop functionality, and comprehensive error tracking.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Testing](#testing)
- [Storybook](#storybook)
- [Docker](#docker)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Features

- **User Authentication**
  - JWT-based authentication
  - Sign in / Sign up functionality
  - Password recovery with email verification
  - Protected routes with automatic token refresh

- **Expense Management**
  - View, create, and manage expense records
  - Drag and drop to reorder expenses
  - Date filtering and pagination
  - Invoice upload with OCR data extraction

- **Error Tracking**
  - Sentry integration for error monitoring
  - Performance monitoring
  - Source maps for production debugging

- **Modern UI/UX**
  - Responsive design
  - Reusable component library
  - Form validation with React Hook Form
  - Loading states and error handling

- **Developer Experience**
  - TypeScript for type safety
  - ESLint and Prettier for code quality
  - Comprehensive test coverage (340+ tests)
  - Storybook for component development
  - Hot module replacement with Vite

## Tech Stack

- **Framework**: React 19.1
- **Build Tool**: Vite 7.0
- **Language**: TypeScript 5.8
- **Routing**: React Router DOM 7.9
- **Forms**: React Hook Form 7.66 + Yup validation
- **HTTP Client**: Axios 1.13
- **Error Tracking**: Sentry React 10.25
- **Testing**: Jest 30 + React Testing Library 16
- **Component Development**: Storybook 10
- **Styling**: CSS Modules
- **CI/CD**: GitHub Actions

## Prerequisites

- **Node.js**: 20.x or higher
- **npm**: 10.x or higher
- **Backend API**: ExpenseTracker API running on `http://localhost:3000` (or configured URL)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/igorg9810/expense-tracker-frontend.git
cd expense-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#environment-variables) section).

**Minimum required:**

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Start Development Server

```bash
npm run dev
```

Application will be available at `http://localhost:5173`

### 5. Build for Production (Optional)

```bash
npm run build
npm run preview
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Backend API URL (Required)
VITE_API_BASE_URL=http://localhost:3000

# Sentry Configuration (Optional)
VITE_SENTRY_DSN=https://your_sentry_dsn_here
VITE_SENTRY_ENABLED=false
VITE_APP_VERSION=1.0.0

# Sentry Build Configuration (Optional - for source maps upload)
SENTRY_ORG=your-organization-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your_auth_token
```

### Environment Variable Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL | Yes | - |
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking | No | - |
| `VITE_SENTRY_ENABLED` | Enable Sentry in development | No | `false` |
| `VITE_APP_VERSION` | Application version | No | `1.0.0` |
| `SENTRY_ORG` | Sentry organization slug | No | - |
| `SENTRY_PROJECT` | Sentry project slug | No | - |
| `SENTRY_AUTH_TOKEN` | Sentry auth token | No | - |

**Note**: Variables prefixed with `VITE_` are exposed to the client. Never put sensitive secrets in client-side variables.

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Run Stylelint
npm run stylelint

# Fix Stylelint issues
npm run stylelint:fix

# Format code with Prettier
npm run format

# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

### Code Quality

This project uses:

- **ESLint**: JavaScript/TypeScript linting
- **Stylelint**: CSS linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **Lint-staged**: Run linters on staged files

Pre-commit hooks automatically run:
1. ESLint on staged `.ts` and `.tsx` files
2. Stylelint on staged `.css` files
3. Prettier formatting

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

Current coverage: **340+ tests** across components, hooks, and utilities

Coverage includes:
- Component rendering and interactions
- Form validation
- API client and token management
- Authentication flow
- Protected routes
- Custom hooks

### Test Files

Tests are co-located with source files:
- `*.test.tsx` - Component tests
- `*.test.ts` - Utility and hook tests

Example:
```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
```

## Storybook

Storybook is used for component development and documentation.

### Start Storybook

```bash
npm run storybook
```

Storybook will be available at `http://localhost:6006`

### Build Storybook

```bash
npm run build-storybook
```

### Features

- Component documentation with MDX
- Interactive props controls
- Accessibility testing (a11y addon)
- Visual regression testing (Vitest addon)
- Dark mode support

## Docker

### Build Docker Image

```bash
docker build -t expense-tracker-frontend .
```

### Run Container

**Basic:**

```bash
docker run -d \
  --name expense-tracker-frontend \
  -p 8080:80 \
  -e VITE_API_BASE_URL=http://localhost:3000 \
  expense-tracker-frontend
```

**With Sentry:**

```bash
docker run -d \
  --name expense-tracker-frontend \
  -p 8080:80 \
  -e VITE_API_BASE_URL=http://localhost:3000 \
  -e VITE_SENTRY_DSN=your_dsn \
  -e VITE_SENTRY_ENABLED=true \
  expense-tracker-frontend
```

Application will be available at `http://localhost:8080`

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      args:
        VITE_API_BASE_URL: http://localhost:3000
    ports:
      - "8080:80"
    restart: unless-stopped
```

**Start:**

```bash
docker-compose up -d
```

**Stop:**

```bash
docker-compose down
```

### Multi-Stage Build

The Dockerfile uses a multi-stage build:

**Stage 1: Builder**
- Node.js 20 Alpine
- Installs dependencies
- Builds production bundle
- Uploads source maps to Sentry (if configured)

**Stage 2: Production**
- Nginx Alpine
- Serves static files
- Health check endpoint at `/health`
- Optimized for production

**Benefits:**
- Small image size (< 50MB)
- Fast builds with layer caching
- Security: no source code in final image
- Production-ready Nginx configuration

## Deployment

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) includes:

**Jobs:**
1. **Test** - Run tests and generate coverage
2. **Lint** - ESLint and Stylelint checks
3. **Security Audit** - npm audit for vulnerabilities
4. **Build** - Build production bundle
5. **Test Build** - Verify build artifacts
6. **E2E Tests** - End-to-end testing (Playwright)
7. **Docker Build** - Build and test Docker image
8. **Docker Push** - Push to GitHub Container Registry
9. **Deploy** - Deploy to production server

### Deployment Methods

The pipeline supports multiple deployment strategies:

1. **SSH + Docker** - Deploy Docker container via SSH
2. **SSH + Docker Compose** - Deploy using docker-compose
3. **Docker Swarm** - Deploy to Docker Swarm cluster
4. **Kubernetes** - Deploy to Kubernetes cluster
5. **Static Files** - Deploy built files to web server

### GitHub Secrets Required

For deployment, configure these secrets in GitHub:

**Required:**
- `VITE_API_BASE_URL` - Backend API URL

**Optional (Sentry):**
- `VITE_SENTRY_DSN`
- `VITE_SENTRY_ENABLED`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`

**Optional (SSH Deployment):**
- `DEPLOY_HOST` - Server hostname/IP
- `DEPLOY_USER` - SSH username
- `DEPLOY_SSH_KEY` - Private SSH key
- `DEPLOY_PORT` - SSH port (default: 22)
- `DEPLOY_PATH` - Deployment directory path
- `DEPLOY_CONTAINER_PORT` - Container port (default: 8080)

**Optional (Docker Compose):**
- `USE_DOCKER_COMPOSE` - Set to `true` to use docker-compose

### Manual Deployment

**Build and deploy manually:**

```bash
# Build Docker image
docker build -t expense-tracker-frontend:latest \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  .

# Push to registry
docker tag expense-tracker-frontend:latest registry.example.com/expense-tracker-frontend:latest
docker push registry.example.com/expense-tracker-frontend:latest

# Deploy on server
ssh user@server
docker pull registry.example.com/expense-tracker-frontend:latest
docker stop expense-tracker-frontend || true
docker rm expense-tracker-frontend || true
docker run -d \
  --name expense-tracker-frontend \
  -p 8080:80 \
  --restart unless-stopped \
  registry.example.com/expense-tracker-frontend:latest
```

## Project Structure

```
expense-tracker/
+-- .github/
|   +-- workflows/
|       +-- ci.yml                  # CI/CD pipeline
+-- public/                          # Static assets
+-- src/
|   +-- assets/
|   |   +-- icons/                   # Icon components
|   +-- components/
|   |   +-- Button/                  # Button component
|   |   +-- DatePicker/              # Date picker component
|   |   +-- Icon/                    # Icon component
|   |   +-- Input/                   # Input component
|   |   +-- InputLabel/              # Label component
|   |   +-- Loader/                  # Loading spinner
|   |   +-- Logo/                    # Logo component
|   |   +-- PasswordInput/           # Password input
|   +-- hooks/                       # Custom React hooks
|   +-- layouts/
|   |   +-- AuthLayout/              # Authentication layout
|   +-- pages/
|   |   +-- ExpenseTable/            # Expense list page
|   |   +-- ForgotPassword/          # Password reset request
|   |   +-- Profile/                 # User profile page
|   |   +-- RestorePassword/         # Password reset confirmation
|   |   +-- SignIn/                  # Sign in page
|   |   +-- SignUp/                  # Sign up page
|   |   +-- Success/                 # Success page
|   |   +-- VerificationCode/        # Email verification
|   +-- routes/
|   |   +-- AppRouter.tsx            # App routing configuration
|   |   +-- PrivateRoute.tsx         # Protected route wrapper
|   |   +-- constants.ts             # Route constants
|   +-- utils/
|   |   +-- auth/                    # Authentication utilities
|   |   |   +-- apiClient.ts         # Axios configuration
|   |   |   +-- tokenManager.ts      # Token management
|   |   +-- hooks/                   # Utility hooks
|   |   +-- validation/              # Form validation schemas
|   +-- App.tsx                      # Root component
|   +-- main.tsx                     # Application entry
|   +-- sentry.ts                    # Sentry configuration
+-- .dockerignore                    # Docker ignore patterns
+-- .eslintrc.js                     # ESLint configuration
+-- .gitignore                       # Git ignore patterns
+-- .prettierrc                      # Prettier configuration
+-- docker-compose.yml               # Docker Compose config
+-- Dockerfile                       # Docker build instructions
+-- env.example                      # Environment template
+-- jest.config.js                   # Jest configuration
+-- nginx.conf                       # Nginx configuration
+-- package.json                     # Dependencies and scripts
+-- tsconfig.json                    # TypeScript configuration
+-- vite.config.ts                   # Vite configuration
```

### Key Directories

- **`src/components/`** - Reusable UI components with tests and stories
- **`src/pages/`** - Page-level components for routes
- **`src/utils/auth/`** - Authentication logic and API client
- **`src/routes/`** - Routing configuration and guards
- **`src/hooks/`** - Custom React hooks
- **`.github/workflows/`** - CI/CD pipelines

## Contributing

### Development Workflow

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write tests for new features
   - Update documentation as needed
   - Follow the existing code style

4. **Run quality checks**
   ```bash
   npm run lint
   npm run test
   npm run format
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation only
   - `style:` - Code style changes
   - `refactor:` - Code refactoring
   - `test:` - Test changes
   - `chore:` - Build/tooling changes

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**

### Code Standards

- **TypeScript**: Use strict typing, avoid `any`
- **Components**: Functional components with hooks
- **Styling**: CSS Modules for component styling
- **Testing**: Write tests for all new features
- **Documentation**: Add JSDoc comments for complex logic

### Pull Request Guidelines

- Provide a clear description of changes
- Reference related issues
- Ensure all tests pass
- Update documentation if needed
- Keep PRs focused on a single feature/fix

## License

This project is licensed under the MIT License.

## Author

**Igor Golubenkov**
- GitHub: [@igorg9810](https://github.com/igorg9810)

## Related Projects

- [ExpenseTracker Backend](https://github.com/igorg9810/expense-tracker-backend) - Node.js/Express API

## Support

For issues and questions:
- Open an [issue](https://github.com/igorg9810/expense-tracker-frontend/issues) on GitHub
- Check existing issues for solutions

---

Happy Expense Tracking!
