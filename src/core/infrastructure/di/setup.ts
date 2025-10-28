import { container } from './container';

// Services
import { KeycloakService } from '@/modules/authentication/infrastructure/keycloak/keycloak.service';

// Repositories
import { KeycloakUserRepository } from '@/modules/authentication/infrastructure/keycloak/repositories/keycloak-user.repository';
import { KeycloakAuthRepository } from '@/modules/authentication/infrastructure/keycloak/repositories/keycloak-auth.repository';

// Use Cases
import { RegisterUserUseCase } from '@/modules/authentication/application/usecases/user/register-user.usecase';
import { LoginUseCase } from '@/modules/authentication/application/usecases/auth/login.usecase';
import { RefreshTokenUseCase } from '@/modules/authentication/application/usecases/auth/refresh-token.usecase';
import { LogoutUseCase } from '@/modules/authentication/application/usecases/auth/logout.usecase';

// Controllers
import { AuthController } from '@/modules/authentication/application/controllers/auth.controller';

/**
 * setupDependencies
 *
 * Configura e registra todas as dependências no container DI.
 * Deve ser chamado no início da aplicação, antes de qualquer resolução de dependência.
 */
export function setupDependencies(): void {
  // ==========================================
  // SERVICES (Singleton - compartilhados)
  // ==========================================
  container.registerSingleton('KeycloakService', KeycloakService);

  // ==========================================
  // REPOSITORIES (Singleton - compartilhados)
  // ==========================================
  container.registerFactory('UserRepository', () => {
    const keycloakService = container.resolve<KeycloakService>('KeycloakService');
    return new KeycloakUserRepository(keycloakService);
  });

  container.registerFactory('AuthRepository', () => {
    const keycloakService = container.resolve<KeycloakService>('KeycloakService');
    return new KeycloakAuthRepository(keycloakService);
  });

  // ==========================================
  // USE CASES (Factory - nova instância com dependências injetadas)
  // ==========================================

  // User Use Cases
  container.registerFactory('RegisterUserUseCase', () => {
    const userRepository = container.resolve<KeycloakUserRepository>('UserRepository');
    return new RegisterUserUseCase(userRepository);
  });

  // Auth Use Cases
  container.registerFactory('LoginUseCase', () => {
    const authRepository = container.resolve<KeycloakAuthRepository>('AuthRepository');
    const userRepository = container.resolve<KeycloakUserRepository>('UserRepository');
    return new LoginUseCase(authRepository, userRepository);
  });

  container.registerFactory('RefreshTokenUseCase', () => {
    const authRepository = container.resolve<KeycloakAuthRepository>('AuthRepository');
    return new RefreshTokenUseCase(authRepository);
  });

  container.registerFactory('LogoutUseCase', () => {
    const authRepository = container.resolve<KeycloakAuthRepository>('AuthRepository');
    return new LogoutUseCase(authRepository);
  });

  // ==========================================
  // CONTROLLERS (Factory - nova instância com use cases injetados)
  // ==========================================
  container.registerFactory('AuthController', () => {
    const registerUserUseCase = container.resolve<RegisterUserUseCase>('RegisterUserUseCase');
    const loginUseCase = container.resolve<LoginUseCase>('LoginUseCase');
    const refreshTokenUseCase = container.resolve<RefreshTokenUseCase>('RefreshTokenUseCase');
    const logoutUseCase = container.resolve<LogoutUseCase>('LogoutUseCase');

    return new AuthController(
      registerUserUseCase,
      loginUseCase,
      refreshTokenUseCase,
      logoutUseCase
    );
  });
}
