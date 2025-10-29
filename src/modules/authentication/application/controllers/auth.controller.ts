import { RegisterUserUseCase } from '../usecases/user/register-user.usecase';
import { LoginUseCase } from '../usecases/auth/login.usecase';
import { RefreshTokenUseCase } from '../usecases/auth/refresh-token.usecase';
import { LogoutUseCase } from '../usecases/auth/logout.usecase';
import { InputRegisterUserDto } from '../dtos/register-user.dto';
import { InputLoginDto } from '../dtos/login.dto';
import { InputRefreshTokenDto } from '../dtos/refresh-token.dto';
import { InputLogoutDto } from '../dtos/logout.dto';

/**
 * AuthController (Clean Architecture)
 *
 * Controller da camada de aplicação que orquestra use cases e presenters.
 * NÃO conhece detalhes de HTTP (Request/Response).
 * Recebe dados já parseados e retorna objetos de domínio.
 */
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase
  ) {}

  /**
   * Registra um novo usuário
   */
  async registerUser(input: InputRegisterUserDto) {
    return await this.registerUserUseCase.execute(input);
  }

  /**
   * Realiza login do usuário
   */
  async login(input: InputLoginDto) {
    return await this.loginUseCase.execute(input);
  }

  /**
   * Renova o access token
   */
  async refreshToken(input: InputRefreshTokenDto) {
    return await this.refreshTokenUseCase.execute(input);
  }

  /**
   * Realiza logout do usuário
   */
  async logout(input: InputLogoutDto) {
    return await this.logoutUseCase.execute(input);
  }
}
