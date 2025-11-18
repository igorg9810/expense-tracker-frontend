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

**Ivan Golubenkov**
- GitHub: [@igorg9810](https://github.com/igorg9810)

## Related Projects

- [ExpenseTracker Backend](https://github.com/igorg9810/expense-tracker-backend) - Node.js/Express API

## Support

For issues and questions:
- Open an [issue](https://github.com/igorg9810/expense-tracker-frontend/issues) on GitHub
- Check existing issues for solutions

## Acknowledgments

- React team for the amazing framework
- Vite for blazing fast development
- Sentry for error tracking
- All open-source contributors

---

Happy Expense Tracking!
- Unit tests added.

```js
{
  name: string,
  amount: number,
  currency?: "USD" | "EUR",
  date: string
}
```

---

<details>
<summary>AI Prompt (NodeJS)</summary>

Perform Backend Task 1 from the README file `expense-tracker/README.md`:

- Work in the `expense-tracker` folder
- Create a new endpoint that accepts a JPG invoice image (up to 5MB) as input
- Validate the file format and size (jpg, ≤5MB)
- Do not save the file anywhere
- Analyze the image and return an object with fields: name, amount, currency (USD/EUR), date
- Return an error if the file could not be parsed
- Add unit tests for the endpoint and logic
- Do not skip any Acceptance Criteria from the README
- After completion, provide a short report on what was done and what needs to be done manually

</details>

---

</details>

<details>
<summary>Task 2: Saving the order in which records are displayed</summary>

---

**Description:**

Drag & drag functionality will be added to the frontend. It is necessary to provide support for this functionality on the backend.

**Acceptance Criteria:**

- A new field has been added to the `Expenses` model to save the display order of a record.
- Added a new endpoint for updating the order of records.
- Updated endpoint for receiving records. Now the data should be sorted by the order field.

---

<details>
<summary>AI Prompt (NodeJS)</summary>

Perform Backend Task 2 from the README file `expense-tracker/README.md`:

- Work in the `expense-tracker` folder
- Add a new field to the `Expenses` model to store the display order
- Create a new endpoint for updating the order of records
- Update the endpoint for retrieving records to sort by the order field
- Do not skip any Acceptance Criteria from the README
- After completion, provide a short report on what was done and what needs to be done manually

</details>

---

</details>

<details>
<summary>Task 3: Add logger</summary>

---

**Description:**

To improve debugging, monitoring, and error tracking, we need to integrate a logging system into the project. The logger should provide different log levels (e.g., info, warn, error, debug) and support structured logging.

**Acceptance Criteria:**

- A logging system has been implemented with support for multiple log levels (e.g., info, warn, error, debug).
- Logs have been structured to include timestamps and relevant contextual information.
- Logging has been added to key application areas, such as API requests, database operations, and error handling.
- A mechanism has been introduced to store logs efficiently, supporting both local and external log management solutions.
- Configuration options have been provided to enable or disable logging in different environments (development, production).
- Unit tests added.
- ***

<details>
<summary>AI Prompt (NodeJS)</summary>

Perform Backend Task 3 from the README file `expense-tracker/README.md`:

- Work in the `expense-tracker` folder
- Integrate a logging system with multiple log levels (info, warn, error, debug)
- Structure logs with timestamps and contextual information
- Add logging to key areas: API requests, DB operations, error handling
- Support both local and external log management solutions
- Provide configuration for enabling/disabling logging in different environments
- Add unit tests for logging logic
- Do not skip any Acceptance Criteria from the README
- After completion, provide a short report on what was done and what needs to be done manually

</details>

---

</details>

<details>
<summary>Task 4: Analyze and Optimize RPS Performance</summary>

---

**Description:**

To ensure optimal system performance and scalability, an analysis of the existing endpoints has been conducted. The goal was to identify bottlenecks, explore optimization opportunities, and implement improvements. After implementing the solutions, RPS was analyzed again to measure performance gains.

**Acceptance Criteria:**

- Existing endpoints have been analyzed to identify performance bottlenecks.
- Potential optimization techniques (e.g., caching, indexing, query optimization, load balancing, multi threads) have been evaluated and implemented where applicable.
- After optimizations, RPS has been measured again to assess performance improvements.
- A summary report with findings, implemented solutions, and performance comparisons has been created.

---

<details>
<summary>AI Prompt (NodeJS)</summary>

Perform Backend Task 4 from the README file `expense-tracker/README.md`:

- Work in the `expense-tracker` folder
- Analyze existing endpoints to identify performance bottlenecks
- Evaluate and implement optimization techniques (caching, indexing, query optimization, load balancing, multi-threading) where applicable
- Measure RPS before and after optimizations
- Create a summary report with findings, solutions, and performance comparisons
- Do not skip any Acceptance Criteria from the README
- After completion, provide a short report on what was done and what needs to be done manually

</details>

---

</details>

<details>
<summary>Task 5: Containerize Backend with Docker</summary>

---

**Description:**

To improve deployment efficiency and maintainability, the backend has been containerized using Docker. The application can now be consistently deployed across different environments with minimal configuration overhead.

**Acceptance Criteria:**

- A Dockerfile has been created and optimized for production use.
- A .dockerignore file has been added to exclude unnecessary files from the image.
- The application runs successfully inside a Docker container.
- Environment variables are managed securely and injected into the container.
- The container has been tested locally to ensure it functions correctly.

---

<details>
<summary>AI Prompt (NodeJS)</summary>

Perform Backend Task 5 from the README file `expense-tracker/README.md`:

- Work in the `expense-tracker` folder
- Create and optimize a Dockerfile for production use
- Add a .dockerignore file to exclude unnecessary files
- Ensure the application runs successfully inside a Docker container
- Manage environment variables securely and inject them into the container
- Test the container locally
- Do not skip any Acceptance Criteria from the README
- After completion, provide a short report on what was done and what needs to be done manually

</details>

---

</details>

<details>
<summary>Task 6: Add GitHub Action for CI/CD</summary>

---

**Description:**

To automate the development workflow, a GitHub Action has been added. This workflow ensures that all necessary checks are performed before merging code changes.

**Acceptance Criteria:**

- A GitHub Action workflow file (`.github/workflows/ci.yml`) has been created.
- The workflow includes the following steps:
  - Run unit and integration tests.
  - Perform type checking.
  - Check code formatting (e.g., Prettier, ESLint).
  - Build the application to ensure there are no compilation errors.
  - Build a Docker container to validate the deployment process.
- The workflow runs automatically on every pull request and push to main.
- Status checks have been integrated into GitHub to prevent merging if tests fail.

---

<details>
<summary>AI Prompt (NodeJS)</summary>

Perform Backend Task 6 from the README file `expense-tracker/README.md`:

- Work in the `expense-tracker` folder
- Create a GitHub Action workflow file (`.github/workflows/ci.yml`)
- Add steps for running unit/integration tests, type checking, code formatting, building the app, and building a Docker container
- Ensure the workflow runs on every pull request and push to main
- Integrate status checks to prevent merging if tests fail
- Do not skip any Acceptance Criteria from the README
- After completion, provide a short report on what was done and what needs to be done manually

</details>

---

</details>

<details>
<summary>Task 7: Deploy Application</summary>

---

**Description:**

To make the application available for production use, a deployment pipeline has been set up. The deployment process ensures smooth updates with minimal downtime.

**Acceptance Criteria:**

- The backend application has been deployed to the target environment.
- The deployment process is automated through a CI/CD pipeline.
- Environment variables are securely injected during deployment.
- Monitoring and logging tools have been configured to track application performance.

---

<details>
<summary>AI Prompt (NodeJS)</summary>

Perform Backend Task 7 from the README file `expense-tracker/README.md`:

- Work in the `expense-tracker` folder
- Deploy the backend application to the target environment
- Automate the deployment process through a CI/CD pipeline
- Securely inject environment variables during deployment
- Configure monitoring and logging tools to track application performance
- Do not skip any Acceptance Criteria from the README
- After completion, provide a short report on what was done and what needs to be done manually

</details>

---

</details>

## Frontend

<details>
<summary>Task 1: Upload Invoice and Pre-fill Expense Form</summary>

---

**Description:**

To streamline the expense creation process, a feature for uploading invoices has been implemented. Users can upload a JPG image (up to 5MB) via a modal, and the backend extracts relevant data to pre-fill the expense form.

**Acceptance Criteria:**

- A "Upload Invoice" button has been added to the sidebar.
- Clicking the button opens a modal window.
- The modal supports drag & drop and file selection.
- Only JPG files up to 5MB are accepted.
- The image is sent to the backend, which returns extracted invoice data.
- The expense form is pre-filled with the received data.
- Proper validation and error handling have been implemented.
- Storybook added.
- Unit tests added.

---

<details>
<summary>AI Prompt (React)</summary>

Perform Frontend Task 1 from the README file `expense-tracker/README.md`:

- Work in the `expense-tracker` folder
- Add a "Upload Invoice" button to the sidebar
- Implement a modal window with drag & drop and file selection for JPG files up to 5MB
- Send the image to the backend and pre-fill the expense form with the received data
- Add validation and error handling for file type, size, and backend errors
- Add Storybook stories for the modal and upload components
- Add unit tests for the upload and pre-fill logic
- After completion, provide a short report on what was done and what needs to be done manually

</details>

---

</details>

<details>
<summary>Task 2: Implement Drag & Drop Functionality</summary>

---

**Description:**

Drag & Drop functionality has been added to enhance usability. Users can now interact with expense table records.

**Acceptance Criteria:**

- Drag & Drop functionality has been integrated.
- The system correctly processes dropped elements.
- The previously created API endpoint is used to persist changes.

---

<details>
<summary>AI Prompt (React)</summary>

Perform Frontend Task 2 from the README file `expense-tracker/README.md`:

- Work in the `expense-tracker` folder
- Integrate drag & drop functionality for expense table records
- Use the backend API endpoint to persist the new order of records
- Ensure correct processing of dropped elements and update the UI accordingly
- Add unit tests for drag & drop logic
- Add Storybook stories for drag & drop components
- After completion, provide a short report on what was done and what needs to be done manually

</details>

---

</details>

<details>
<summary>Task 3: DevTools and Render Optimization</summary>

---

**Description:**

To improve application performance, DevTools have been used to analyze and optimize unnecessary re-renders.

**Acceptance Criteria:**

- DevTools for performance analysis (React DevTools, Redux DevTools, why-did-you-render) have been installed.
- Components with excessive re-renders have been identified.
- Unnecessary renders have been optimized using memoization, useCallback, and useMemo where applicable.
- Performance improvements have been verified with updated benchmarks.

---

<details>
<summary>AI Prompt (React)</summary>

Perform Frontend Task 3 from the README file `expense-tracker/README.md`:

- Work in the `expense-tracker` folder
- Install and use DevTools (React DevTools, Redux DevTools, why-did-you-render) to analyze re-renders
- Identify components with excessive re-renders and optimize them using memoization, useCallback, and useMemo
- Verify performance improvements with updated benchmarks
- After completion, provide a short report on what was done and what needs to be done manually

</details>

---

</details>

<details>
<summary>Task 4: Integrate Logging Tools (Sentry)</summary>

---

**Description:**

To improve error tracking and debugging, logging tools have been integrated into the frontend.

**Acceptance Criteria:**

- Sentry has been integrated for logging errors and performance issues.
- Source maps have been configured for better debugging.
- Global error boundaries have been added to prevent UI crashes.
- Logs include user actions and relevant context for debugging.

---

<details>
<summary>AI Prompt (React)</summary>

Perform Frontend Task 4 from the README file `expense-tracker/README.md`:

- Work in the `expense-tracker` folder
- Integrate Sentry for error and performance logging
- Configure source maps for better debugging
- Add global error boundaries to prevent UI crashes
- Ensure logs include user actions and relevant context
- After completion, provide a short report on what was done and what needs to be done manually

</details>

---

</details>

<details>
<summary>Task 5: Add Docker Container for Frontend</summary>

---

**Description:**

To ensure consistency across environments, the frontend has been containerized using Docker.

**Acceptance Criteria:**

- A Dockerfile has been created for the frontend.
- A .dockerignore file has been added.
- The application runs successfully inside a Docker container.

---

<details>
<summary>AI Prompt (React)</summary>

Perform Frontend Task 5 from the README file `expense-tracker/README.md`:

- Work in the `expense-tracker` folder
- Create a Dockerfile and .dockerignore for the frontend
- Ensure the application runs successfully inside a Docker container
- After completion, provide a short report on what was done and what needs to be done manually

</details>

---

</details>

<details>
<summary>Task 6: CI/CD for Frontend</summary>

---

**Description:**

A CI/CD pipeline has been added to automate testing, linting, and building of the frontend application.

**Acceptance Criteria:**

- A GitHub Action workflow has been created.
- The workflow includes:
  - Linting and formatting checks.
  - Unit and integration tests execution.
  - Building the frontend application.
  - Building a Docker image for deployment.
- The pipeline runs on pull requests and pushes to main.

---

<details>
<summary>AI Prompt (React)</summary>

Perform Frontend Task 6 from the README file `expense-tracker/README.md`:

- Work in the `expense-tracker` folder
- Create a GitHub Action workflow for the frontend (`.github/workflows/ci.yml`)
- Add steps for linting, formatting, unit/integration tests, building the app, and building a Docker image
- Ensure the pipeline runs on pull requests and pushes to master
- After completion, provide a short report on what was done and what needs to be done manually

</details>

---

</details>

<details>
<summary>Task 7: Deploy Frontend to Server</summary>

---

**Description:**

To make the frontend application accessible, an automated deployment pipeline has been set up.

**Acceptance Criteria:**

- The application has been deployed to the target environment.
- The deployment process is automated and triggered by the CI/CD pipeline.
- Environment variables are securely managed.

---

<details>
<summary>AI Prompt (React)</summary>

Perform Frontend Task 7 from the README file `expense-tracker/README.md`:

- Work in the `expense-tracker` folder
- Deploy the frontend application to the target environment
- Automate the deployment process via the CI/CD pipeline
- Ensure environment variables are securely managed
- After completion, provide a short report on what was done and what needs to be done manually

</details>

---

</details>

## Solution

In progress...

<!-- If you've already finished working on this part or are stuck, these repositories might be useful to you.
  - [API](https://github.com/petproject-dev/expense-tracker-backend-part-4) - Express.js
  - [UI](https://github.com/petproject-dev/expense-tracker-frontend-part-4) - React -->

## Found an Issue?

We strive to make the project as clear and helpful as possible. If you notice any errors, inconsistencies, or unclear instructions, please open a Pull Request in this repository with your suggested fixes or improvements. Your feedback helps improve the learning experience for everyone!

Happy coding, and good luck with this part of the project!
