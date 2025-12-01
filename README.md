# FIAP Pós-Tech - Auth Service

Serviço de autenticação e autorização com Keycloak usando Clean Architecture e OAuth2/OpenID Connect.

## Tech Stack

- **Runtime:** Node.js 22 + TypeScript 5.8
- **Framework:** Express.js 5.1
- **Identity Provider:** Keycloak 23
- **Database:** PostgreSQL 15 (Keycloak)
- **Validation:** Zod
- **Auth:** jsonwebtoken, jwks-rsa, @keycloak/keycloak-admin-client
- **API Docs:** Swagger (swagger-jsdoc + swagger-ui-express)
- **Testing:** Jest 30 + ts-jest
- **Architecture:** Clean Architecture + DDD

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Development mode (hot-reload)
docker compose --profile dev up -d

# Production mode
docker compose --profile prd up -d

# View logs
docker compose logs -f fiap-pos-tech-auth-dev
```

**Services:**
- Auth Service (Dev): http://localhost:3002
- Auth Service (Prod): http://localhost:3003
- Keycloak Admin: http://localhost:8080 (admin/admin)
- Swagger UI: http://localhost:3002/api-docs

### Option 2: Local Development

```bash
# 1. Start Keycloak
docker compose up -d keycloak keycloak-postgres

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Run service
npm run dev
```

### Health Check

```bash
curl http://localhost:3002/health
```

## NPM Scripts

```bash
npm run dev          # Development with hot-reload
npm run build        # Compile TypeScript
npm start            # Run production build
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Coverage report (80% threshold)
npm run lint         # Lint code
npm run lint:fix     # Fix linting issues
```

## Configuration

### Environment Variables

Create `.env` from `.env.example`:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Auth service port | `3002` |
| `KEYCLOAK_URL` | Keycloak URL | `http://localhost:8080` |
| `KEYCLOAK_REALM` | Realm name | `fiap-pos-tech` |
| `KEYCLOAK_CLIENT_ID` | Client ID | `pos-tech-api` |
| `KEYCLOAK_CLIENT_SECRET` | Client secret | **REQUIRED** |
| `KEYCLOAK_ADMIN_USERNAME` | Admin username | `admin` |
| `KEYCLOAK_ADMIN_PASSWORD` | Admin password | `admin` |
| `ALLOWED_ORIGINS` | CORS origins | `http://localhost:3000,http://localhost:3001` |

### Keycloak Setup

The realm configuration is auto-imported on startup from `keycloak/import/fiap-pos-tech-realm.json`.

**Pre-configured:**
- Realm: `fiap-pos-tech`
- Client: `pos-tech-api` (confidential)
- Default user: `admin` / `admin123` (admin@fiap.com)

**⚠️ Change client secret in production:**

```bash
# Option 1: Via Admin Console
# http://localhost:8080 → Clients → pos-tech-api → Credentials → Regenerate Secret

# Option 2: Edit keycloak/import/fiap-pos-tech-realm.json
# Update "secret" field and restart containers
docker compose down -v && docker compose up -d
```

## API Reference

**Base URL:** `http://localhost:3002`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/auth/register` | POST | Register user (CPF, password, email, names) |
| `/auth/login` | POST | Login (CPF, password) → JWT tokens |
| `/auth/refresh` | POST | Refresh access token |
| `/auth/logout` | POST | Logout (revoke refresh token) |
| `/api-docs` | GET | Swagger documentation |

**Authentication uses CPF as username.** All endpoints validated with Zod schemas.

### Example: Login

```bash
curl -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901",
    "password": "SenhaForte123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "expiresIn": 300,
    "tokenType": "Bearer",
    "user": {
      "id": "uuid",
      "username": "12345678901",
      "email": "user@example.com"
    }
  }
}
```

For detailed API documentation, visit: http://localhost:3002/api-docs

## Project Structure

Clean Architecture with 3 layers:

## Project Structure

Clean Architecture with 3 layers:

```
src/
├── core/                           # Shared infrastructure
│   ├── application/                # Base use case interface & errors
│   ├── domain/entities/            # Base entity
│   └── infrastructure/
│       ├── di/                     # Dependency injection container
│       ├── http/                   # Routes, middlewares (error, validation)
│       └── swagger/                # API documentation
│
└── modules/authentication/         # Auth domain module
    ├── application/
    │   ├── controllers/            # Business controllers
    │   ├── dtos/                   # Zod validation schemas
    │   └── usecases/               # Business logic (login, register, logout, refresh)
    │
    ├── domain/
    │   ├── entities/               # User, AuthToken entities
    │   └── repositories/           # Repository interfaces
    │
    └── infrastructure/
        ├── controllers/http/       # HTTP adapters
        ├── http/                   # Route definitions
        ├── keycloak/               # Keycloak integration & repositories
        └── presenters/             # Response formatters
```

**Key Principles:**
- **Domain:** Business entities and repository interfaces (framework-agnostic)
- **Application:** Use cases orchestrating business logic with DTOs
- **Infrastructure:** External integrations (Keycloak, HTTP, databases)

## Development

### Docker Services

```bash
# Start/stop individual services
docker compose up -d keycloak keycloak-postgres
docker compose stop keycloak

# Remove all data
docker compose down -v

# Rebuild containers
docker compose up -d --build
```

### Debugging

```bash
# Check Keycloak health
curl http://localhost:8080/health/ready

# View service logs
docker compose logs -f fiap-pos-tech-auth-dev

# Access Keycloak admin console
open http://localhost:8080
# Login: admin / admin
```

### Testing

Jest is configured with 80% coverage threshold. Run tests with:

```bash
npm test              # Single run
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

**Coverage exclusions:** server.ts, app.ts, config/, DI setup, swagger, routes, types

## Authentication Flow

```
1. Register → POST /auth/register → Keycloak Admin API → User created
2. Login → POST /auth/login → Keycloak OAuth2 (password grant) → JWT tokens
3. Use Token → Authorization: Bearer {token} → Validated by other services via Keycloak public keys
4. Refresh → POST /auth/refresh → New access token
5. Logout → POST /auth/logout → Revoke refresh token
```

**Token Lifespans (Keycloak):**
- Access Token: 300s (5 min)
- SSO Session: 1800s (30 min)
- SSO Session Max: 36000s (10 hours)

## Architecture Notes

- **CPF as Username:** CPF (11 digits) is used as the unique username identifier
- **Password Flow:** OAuth2 Resource Owner Password Credentials Grant
- **Token Validation:** Other services validate JWTs using Keycloak's public keys (jwks-rsa)
- **User Management:** Keycloak Admin Client for user CRUD operations
- **Security:** Helmet headers, CORS, non-root Docker user, brute force protection (5 attempts, 15min lockout)

## Troubleshooting

**Keycloak not starting:**
- Wait 30-60s for initialization
- Check logs: `docker compose logs keycloak`
- Verify PostgreSQL is healthy: `docker compose ps`

**Client secret mismatch:**
- Regenerate in Keycloak Admin Console
- Update `.env` with new secret
- Restart auth service

**CORS errors:**
- Add origin to `ALLOWED_ORIGINS` in `.env`
- Restart service

---

## License

FIAP Pós-Graduação Project

