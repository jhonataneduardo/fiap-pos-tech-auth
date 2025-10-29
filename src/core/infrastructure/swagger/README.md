# Swagger Documentation

Esta pasta contém a documentação OpenAPI/Swagger para a API de autenticação do FIAP Pos Tech.

## Estrutura

```
swagger/
├── index.ts           # Configuração principal do Swagger
├── paths/             # Definições de endpoints
│   ├── index.ts       # Exporta todos os paths
│   ├── health.ts      # Endpoints de health check
│   └── auth.ts        # Endpoints de autenticação
└── schemas/           # Definições de modelos de dados
    ├── index.ts       # Exporta todos os schemas
    ├── common.ts      # Schemas comuns (ApiResponse, ApiError)
    └── auth.ts        # Schemas de autenticação
```

## Padrões

### Paths

Cada arquivo em `paths/` exporta um objeto com as definições dos endpoints:

```typescript
export const authPaths = {
    '/auth/login': {
        post: {
            summary: 'Fazer login',
            description: 'Autentica um usuário e retorna tokens de acesso',
            tags: ['Authentication'],
            requestBody: { ... },
            responses: { ... }
        }
    }
};
```

### Schemas

Cada arquivo em `schemas/` exporta um objeto com as definições de modelos:

```typescript
export const authSchemas = {
    LoginRequest: {
        type: 'object',
        required: ['cpf', 'password'],
        properties: { ... }
    }
};
```

## Endpoints Documentados

### Authentication
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login
- `POST /auth/refresh` - Renovar token de acesso
- `POST /auth/logout` - Fazer logout

### Health
- `GET /health` - Verificar status da API

## Acessando a Documentação

Após iniciar o servidor, acesse:
- URL: http://localhost:3002/api-docs
- Interface: Swagger UI interativa

## Adicionando Novos Endpoints

1. Crie um novo arquivo em `paths/` (ex: `user.ts`)
2. Defina os paths seguindo o padrão OpenAPI 3.0
3. Importe e adicione ao `paths/index.ts`
4. Se necessário, crie schemas correspondentes em `schemas/`

## Schemas Comuns

### ApiResponse
Padrão de resposta para sucesso:
```json
{
  "success": true,
  "content": { ... }
}
```

### ApiError
Padrão de resposta para erros:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

## Referências

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)
