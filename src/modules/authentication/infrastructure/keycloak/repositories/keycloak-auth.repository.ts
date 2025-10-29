import { AuthRepositoryInterface } from '@/modules/authentication/domain/repositories/auth-repository.interface';
import { AuthTokenEntity } from '@/modules/authentication/domain/entities/auth-token.entity';
import { KeycloakService } from '../keycloak.service';

export class KeycloakAuthRepository implements AuthRepositoryInterface {
  constructor(private readonly keycloakService: KeycloakService) {}

  async login(cpf: string, password: string): Promise<AuthTokenEntity> {
    const keycloakTokens = await this.keycloakService.login(cpf, password);

    return new AuthTokenEntity({
      accessToken: keycloakTokens.accessToken,
      refreshToken: keycloakTokens.refreshToken,
      expiresIn: keycloakTokens.expiresIn,
      tokenType: keycloakTokens.tokenType,
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthTokenEntity> {
    const keycloakTokens = await this.keycloakService.refreshToken(refreshToken);

    return new AuthTokenEntity({
      accessToken: keycloakTokens.accessToken,
      refreshToken: keycloakTokens.refreshToken,
      expiresIn: keycloakTokens.expiresIn,
      tokenType: keycloakTokens.tokenType,
    });
  }

  async logout(refreshToken: string): Promise<void> {
    await this.keycloakService.logout(refreshToken);
  }
}
