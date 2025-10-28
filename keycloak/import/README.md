# Configuração do Keycloak

Este diretório contém os arquivos de configuração para inicialização automática do Keycloak com o realm `fiap-pos-tech`.

## Client Secret

**IMPORTANTE:** Você deve alterar o `client secret` antes de usar em produção!

### Como gerar um novo client secret:

1. Acesse o Keycloak Admin Console: `http://localhost:8080`
2. Login: `admin` / `admin`
3. Selecione o realm `fiap-pos-tech`
4. Vá em `Clients` > `pos-tech-api`
5. Vá na aba `Credentials`
6. Clique em `Regenerate Secret`
7. Copie o novo secret

### Como atualizar o secret:

**Opção 1: Variável de ambiente**
```bash
export KEYCLOAK_CLIENT_SECRET="seu-novo-secret-aqui"
```

**Opção 2: Arquivo .env**
```
KEYCLOAK_CLIENT_SECRET=seu-novo-secret-aqui
```

## Configuração do Realm

O arquivo `fiap-pos-tech-realm.json` contém:

- **Realm**: fiap-pos-tech
- **Client**: pos-tech-api (confidential)
- **Access Token Lifespan**: 1 hora
- **Refresh Token**: Habilitado
- **Direct Access Grants**: Habilitado (para login com username/password)
- **Service Accounts**: Habilitado

## Personalização

Para personalizar a configuração:

1. Edite o arquivo `fiap-pos-tech-realm.json`
2. Recrie os containers: `docker-compose down -v && docker-compose up -d`

## Observações

- O secret padrão (`your-client-secret-here`) é apenas para desenvolvimento
- Em produção, SEMPRE use um secret forte e único
- Nunca commite secrets reais no repositório
