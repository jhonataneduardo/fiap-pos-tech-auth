# FIAP Pós-Tech - Auth Service

Serviço de autenticação e autorização com Keycloak para o sistema de vendas de veículos.

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Endpoints](#endpoints)
- [Fluxo de Autenticação](#fluxo-de-autenticação)
- [Documentação da API](#documentação-da-api)
- [Testes](#testes)

---

## Visão Geral

Este serviço é responsável pela autenticação e autorização de usuários utilizando **Keycloak** como provedor de identidade (IdP). Ele fornece endpoints para:

- Registro de novos usuários
- Login (autenticação)
- Refresh de tokens
- Logout

O serviço utiliza **CPF como username** e integra-se com o Keycloak via **Admin API** e **OAuth2/OpenID Connect**.

---

## Arquitetura

```
┌─────────────────┐
│   Frontend/     │
│   Client App    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│  Auth Service   │◄────►│    Keycloak     │
│  (Port 3002)    │      │   (Port 8080)   │
└─────────────────┘      └────────┬────────┘
         │                        │
         │                        ▼
         │               ┌─────────────────┐
         │               │   PostgreSQL    │
         │               │  (Keycloak DB)  │
         │               └─────────────────┘
         ▼
┌─────────────────┐
│  Main API       │
│  (Port 3001)    │
└─────────────────┘
```

**Stack Tecnológica:**
- Node.js 22
- TypeScript
- Express.js
- Keycloak 23
- PostgreSQL 15
- Docker & Docker Compose

---

## Pré-requisitos

- Node.js 22+
- Docker e Docker Compose
- npm ou yarn

---

## Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd fiap-pos-tech-auth
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
NODE_ENV=development
PORT=3002

KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=fiap-pos-tech
KEYCLOAK_CLIENT_ID=pos-tech-api
KEYCLOAK_CLIENT_SECRET=your-client-secret-here
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=admin

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## Configuração

### Keycloak

O projeto já vem com uma configuração pré-definida do Keycloak no arquivo `keycloak/import/fiap-pos-tech-realm.json`.

#### Configuração Automática

Ao subir o Docker Compose, o Keycloak será configurado automaticamente com:

- **Realm:** `fiap-pos-tech`
- **Client:** `pos-tech-api` (confidential)
- **Client Secret:** `your-client-secret-here` (DEVE SER ALTERADO EM PRODUÇÃO!)

#### Alterando o Client Secret

**Opção 1: Via Keycloak Admin Console**

1. Acesse: `http://localhost:8080`
2. Login: `admin` / `admin`
3. Selecione o realm `fiap-pos-tech`
4. Vá em `Clients` > `pos-tech-api` > `Credentials`
5. Clique em `Regenerate Secret`
6. Copie o novo secret e atualize o `.env`

**Opção 2: Editar o arquivo de import**

1. Edite `keycloak/import/fiap-pos-tech-realm.json`
2. Encontre `"secret": "your-client-secret-here"`
3. Substitua pelo novo secret
4. Recrie os containers: `docker-compose down -v && docker-compose up -d`

---

## Executando o Projeto

### Com Docker (Recomendado)

#### Modo Produção

```bash
docker-compose up -d
```

Isso iniciará:
- PostgreSQL (Keycloak DB)
- Keycloak
- Auth Service (produção)

#### Modo Desenvolvimento

```bash
docker-compose --profile dev up -d
```

Ou use o serviço específico:

```bash
docker-compose up -d keycloak keycloak-db
npm run dev
```

### Localmente (sem Docker)

1. **Inicie o Keycloak separadamente**

```bash
docker-compose up -d keycloak keycloak-db
```

2. **Aguarde o Keycloak inicializar** (~30-60 segundos)

3. **Inicie o serviço de autenticação**

```bash
npm run dev
```

### Verificar se está funcionando

```bash
curl http://localhost:3002/health
```

Resposta esperada:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-10-23T00:00:00.000Z",
    "service": "fiap-pos-tech-auth"
  }
}
```

---

## Endpoints

### Base URL
```
http://localhost:3002
```

### Autenticação

#### 1. Registrar Usuário

```http
POST /auth/register
Content-Type: application/json

{
  "cpf": "12345678901",
  "password": "SenhaForte123",
  "email": "usuario@example.com",
  "firstName": "João",
  "lastName": "Silva"
}
```

**Resposta:** 201 Created
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-aqui",
      "username": "12345678901",
      "email": "usuario@example.com",
      "firstName": "João",
      "lastName": "Silva"
    },
    "message": "Usuário criado com sucesso"
  }
}
```

#### 2. Login

```http
POST /auth/login
Content-Type: application/json

{
  "cpf": "12345678901",
  "password": "SenhaForte123"
}
```

**Resposta:** 200 OK
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cC...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cC...",
    "expiresIn": 3600,
    "tokenType": "Bearer",
    "user": {
      "id": "uuid-aqui",
      "username": "12345678901",
      "email": "usuario@example.com"
    }
  }
}
```

#### 3. Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cC..."
}
```

**Resposta:** 200 OK
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cC...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cC...",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  }
}
```

#### 4. Logout

```http
POST /auth/logout
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cC..."
}
```

**Resposta:** 200 OK
```json
{
  "success": true,
  "data": {
    "message": "Logout realizado com sucesso"
  }
}
```

---

## Fluxo de Autenticação

```
1. Client → Auth Service: POST /auth/register (CPF, senha)
2. Auth Service → Keycloak: Criar usuário via Admin API
3. Keycloak → Auth Service: Usuário criado
4. Auth Service → Client: 201 Created

5. Client → Auth Service: POST /auth/login (CPF, senha)
6. Auth Service → Keycloak: Password Grant
7. Keycloak → Auth Service: Access + Refresh Tokens
8. Auth Service → Client: 200 OK (tokens)

9. Client → Main API: Request + Bearer Token
10. Main API → Keycloak: Validar JWT (chave pública)
11. Keycloak → Main API: Token válido
12. Main API → Client: 200 OK (resposta)

13. Client → Auth Service: POST /auth/refresh (refresh token)
14. Auth Service → Keycloak: Refresh Token Grant
15. Keycloak → Auth Service: Novos tokens
16. Auth Service → Client: 200 OK (novos tokens)

17. Client → Auth Service: POST /auth/logout (refresh token)
18. Auth Service → Keycloak: Logout
19. Keycloak → Auth Service: OK
20. Auth Service → Client: 200 OK
```

---

## Documentação da API

A documentação interativa (Swagger) está disponível em:

```
http://localhost:3002/api-docs
```
---

## Estrutura do Projeto

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, organizando o código em camadas bem definidas:

```
fiap-pos-tech-auth/
├── src/
│   ├── app.ts                          # Configuração do Express
│   ├── server.ts                       # Entry point da aplicação
│   │
│   ├── config/                         # Configurações de ambiente
│   │   └── index.ts                    # Variáveis de ambiente centralizadas
│   │
│   ├── core/                           # Núcleo da aplicação (camadas compartilhadas)
│   │   ├── application/                # Camada de aplicação
│   │   │   ├── use-case.interface.ts   # Interface base para casos de uso
│   │   │   └── errors/
│   │   │       └── app.error.ts        # Erros customizados da aplicação
│   │   │
│   │   ├── domain/                     # Camada de domínio
│   │   │   └── entities/
│   │   │       └── base.entity.ts      # Entidade base
│   │   │
│   │   └── infrastructure/             # Camada de infraestrutura compartilhada
│   │       ├── di/                     # Dependency Injection
│   │       │   ├── container.ts        # Container de dependências
│   │       │   └── setup.ts            # Configuração das dependências
│   │       │
│   │       ├── http/                   # Configuração HTTP
│   │       │   ├── routes.ts           # Registro de rotas
│   │       │   └── middlewares/
│   │       │       ├── error-handler.ts # Handler global de erros
│   │       │       └── validation.ts    # Validação de requests
│   │       │
│   │       └── swagger/                # Documentação da API
│   │
│   ├── modules/                        # Módulos de domínio
│   │   └── authentication/             # Módulo de autenticação
│   │       │
│   │       ├── application/            # Camada de aplicação do módulo
│   │       │   ├── controllers/
│   │       │   │   └── auth.controller.ts  # Controller de negócio
│   │       │   │
│   │       │   ├── dtos/               # Data Transfer Objects
│   │       │   │   ├── login.dto.ts
│   │       │   │   ├── logout.dto.ts
│   │       │   │   ├── refresh-token.dto.ts
│   │       │   │   └── register-user.dto.ts
│   │       │   │
│   │       │   └── usecases/           # Casos de uso (regras de negócio)
│   │       │       ├── auth/
│   │       │       │   ├── login.usecase.ts
│   │       │       │   ├── logout.usecase.ts
│   │       │       │   └── refresh-token.usecase.ts
│   │       │       └── user/
│   │       │           └── register-user.usecase.ts
│   │       │
│   │       ├── domain/                 # Camada de domínio do módulo
│   │       │   ├── entities/           # Entidades de domínio
│   │       │   │   ├── auth-token.entity.ts
│   │       │   │   └── user.entity.ts
│   │       │   │
│   │       │   └── repositories/       # Interfaces de repositórios
│   │       │       ├── auth-repository.interface.ts
│   │       │       └── user-repository.interface.ts
│   │       │
│   │       └── infrastructure/         # Camada de infraestrutura do módulo
│   │           ├── controllers/        # Controllers HTTP
│   │           │   └── http/
│   │           │       └── auth-api.controller.ts
│   │           │
│   │           ├── http/               # Rotas HTTP
│   │           │   └── auth.routes.ts
│   │           │
│   │           ├── keycloak/           # Integração com Keycloak
│   │           │   ├── keycloak.service.ts
│   │           │   ├── token.service.ts
│   │           │   └── repositories/
│   │           │       ├── keycloak-auth.repository.ts
│   │           │       └── keycloak-user.repository.ts
│   │           │
│   │           └── presenters/         # Formatação de respostas
│   │               ├── login.presenter.ts
│   │               ├── refresh-token.presenter.ts
│   │               └── register-user.presenter.ts
│   │
│   ├── swagger/                        # Schemas Swagger adicionais
│   │
│   └── types/                          # Tipos TypeScript globais
│       └── express.d.ts                # Extensões do Express
│
├── keycloak/                           # Configurações do Keycloak
│   ├── realm-export.json               # Export do realm
│   ├── import/                         # Arquivos de importação
│   │   ├── fiap-pos-tech-realm.json    # Configuração do realm
│   │   └── README.md                   # Documentação da configuração
│   └── themes/                         # Temas customizados (opcional)
│
├── .env                                # Variáveis de ambiente (não versionado)
├── .env.example                        # Exemplo de variáveis de ambiente
├── .gitignore                          # Arquivos ignorados pelo Git
├── docker-compose.yml                  # Orquestração dos serviços
├── Dockerfile                          # Build de produção
├── Dockerfile.dev                      # Build de desenvolvimento
├── package.json                        # Dependências e scripts
├── tsconfig.json                       # Configuração do TypeScript
└── README.md                           # Este arquivo
```

### Explicação da Arquitetura

**Clean Architecture em 3 Camadas:**

1. **Domain (Domínio)** 🏛️
   - Entidades de negócio (`entities/`)
   - Interfaces de repositórios (`repositories/`)
   - Regras de negócio puras, independentes de frameworks

2. **Application (Aplicação)** 💼
   - Casos de uso (`usecases/`)
   - Controllers de negócio (`controllers/`)
   - DTOs para validação e transformação de dados (`dtos/`)
   - Orquestra a lógica de negócio

3. **Infrastructure (Infraestrutura)** 🔧
   - Implementação de repositórios (Keycloak)
   - Controllers HTTP/API
   - Rotas e middlewares
   - Presenters para formatação de respostas
   - Integrações externas (Keycloak, databases, etc.)

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente de execução | `development` |
| `PORT` | Porta do serviço | `3002` |
| `KEYCLOAK_URL` | URL do Keycloak | `http://localhost:8080` |
| `KEYCLOAK_REALM` | Nome do realm | `fiap-pos-tech` |
| `KEYCLOAK_CLIENT_ID` | ID do client | `pos-tech-api` |
| `KEYCLOAK_CLIENT_SECRET` | Secret do client | - |
| `KEYCLOAK_ADMIN_USERNAME` | Username do admin | `admin` |
| `KEYCLOAK_ADMIN_PASSWORD` | Senha do admin | `admin` |
| `ALLOWED_ORIGINS` | Origins permitidos (CORS) | `http://localhost:3000,http://localhost:3001` |

---

## Licença

Este projeto é parte do curso de Pós-Graduação da FIAP.

