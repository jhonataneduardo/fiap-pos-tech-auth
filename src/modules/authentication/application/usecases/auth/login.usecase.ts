import { UseCaseInterface } from '@/core/application/use-case.interface';
import { AuthRepositoryInterface } from '@/modules/authentication/domain/repositories/auth-repository.interface';
import { UserRepositoryInterface } from '@/modules/authentication/domain/repositories/user-repository.interface';
import { InputLoginDto, OutputLoginDto } from '../../dtos/login.dto';

export class LoginUseCase implements UseCaseInterface<InputLoginDto, OutputLoginDto> {
  constructor(
    private readonly authRepository: AuthRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async execute(request: InputLoginDto): Promise<OutputLoginDto> {
    // Autentica e obtém tokens
    const authToken = await this.authRepository.login(request.cpf, request.password);

    // Busca informações do usuário
    const user = await this.userRepository.findUserByCpf(request.cpf);

    return {
      accessToken: authToken.accessToken,
      refreshToken: authToken.refreshToken,
      expiresIn: authToken.expiresIn,
      tokenType: authToken.tokenType,
      user: {
        id: user?.id || '',
        cpf: user?.cpf || request.cpf,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
      },
    };
  }
}
