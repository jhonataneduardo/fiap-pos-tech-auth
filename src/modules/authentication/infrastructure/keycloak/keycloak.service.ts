import KcAdminClient from '@keycloak/keycloak-admin-client';
import axios, { AxiosError } from 'axios';
import config from '@/config/index';
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
  InternalServerError,
  InvalidTokenError,
} from '@/core/application/errors/app.error';

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdTimestamp?: number;
}

export class KeycloakService {
  private adminClient: KcAdminClient;
  private tokenEndpoint: string;

  constructor() {
    // Admin client must authenticate against the master realm
    this.adminClient = new KcAdminClient({
      baseUrl: config.keycloak.url,
      realmName: 'master',
    });

    this.tokenEndpoint = `${config.keycloak.url}/realms/${config.keycloak.realm}/protocol/openid-connect/token`;
  }

  /**
   * Autentica o admin client do Keycloak
   */
  private async authenticateAdmin(): Promise<void> {
    try {
      await this.adminClient.auth({
        username: config.keycloak.adminUsername,
        password: config.keycloak.adminPassword,
        grantType: 'password',
        clientId: 'admin-cli',
      });
    } catch (error) {
      console.error('Failed to authenticate admin client:', error);
      throw new InternalServerError('Failed to connect to authentication service');
    }
  }

  /**
   * Realiza login do usuário e retorna tokens
   */
  async login(cpf: string, password: string): Promise<AuthTokenResponse> {
    try {
      const response = await axios.post(
        this.tokenEndpoint,
        new URLSearchParams({
          client_id: config.keycloak.clientId,
          client_secret: config.keycloak.clientSecret,
          grant_type: 'password',
          username: cpf,
          password: password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          throw new InvalidCredentialsError('CPF ou senha inválidos');
        }
      }
      console.error('Login error:', error);
      throw new InternalServerError('Erro ao realizar login');
    }
  }

  /**
   * Renova o access token usando refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokenResponse> {
    try {
      const response = await axios.post(
        this.tokenEndpoint,
        new URLSearchParams({
          client_id: config.keycloak.clientId,
          client_secret: config.keycloak.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 400) {
          throw new InvalidTokenError('Refresh token inválido ou expirado');
        }
      }
      console.error('Refresh token error:', error);
      throw new InternalServerError('Erro ao renovar token');
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout(refreshToken: string): Promise<void> {
    try {
      const logoutEndpoint = `${config.keycloak.url}/realms/${config.keycloak.realm}/protocol/openid-connect/logout`;

      await axios.post(
        logoutEndpoint,
        new URLSearchParams({
          client_id: config.keycloak.clientId,
          client_secret: config.keycloak.clientSecret,
          refresh_token: refreshToken,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
      // Não lançamos erro aqui pois o logout pode falhar se o token já estiver inválido
      // O importante é que o cliente descarte o token
    }
  }

  /**
   * Cria um novo usuário no Keycloak
   */
  async createUser(
    cpf: string,
    password: string,
    email?: string,
    firstName?: string,
    lastName?: string
  ): Promise<UserResponse> {
    try {
      // Autentica o admin client
      await this.authenticateAdmin();

      // Verifica se o usuário já existe
      const existingUsers = await this.adminClient.users.find({
        username: cpf,
        realm: config.keycloak.realm,
      });

      if (existingUsers.length > 0) {
        throw new UserAlreadyExistsError('Usuário com este CPF já existe');
      }

      // Cria o usuário
      const createdUser = await this.adminClient.users.create({
        realm: config.keycloak.realm,
        username: cpf,
        email: email,
        firstName: firstName,
        lastName: lastName,
        enabled: true,
        emailVerified: false,
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ],
      });

      // Busca o usuário criado para retornar os dados completos
      const userId =
        typeof createdUser === 'string' ? createdUser : createdUser.id;

      if (!userId) {
        throw new InternalServerError('Erro ao criar usuário');
      }

      const user = await this.adminClient.users.findOne({
        id: userId,
        realm: config.keycloak.realm,
      });

      if (!user) {
        throw new InternalServerError('Erro ao buscar usuário criado');
      }

      return {
        id: user.id!,
        username: user.username!,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdTimestamp: user.createdTimestamp,
      };
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw error;
      }
      console.error('Create user error:', error);
      throw new InternalServerError('Erro ao criar usuário');
    }
  }

  /**
   * Busca um usuário por CPF (username)
   */
  async findUserByCpf(cpf: string): Promise<UserResponse | null> {
    try {
      await this.authenticateAdmin();

      const users = await this.adminClient.users.find({
        username: cpf,
        realm: config.keycloak.realm,
        exact: true,
      });

      if (users.length === 0) {
        return null;
      }

      const user = users[0];

      return {
        id: user.id!,
        username: user.username!,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdTimestamp: user.createdTimestamp,
      };
    } catch (error) {
      console.error('Find user error:', error);
      throw new InternalServerError('Erro ao buscar usuário');
    }
  }
}

export default new KeycloakService();
