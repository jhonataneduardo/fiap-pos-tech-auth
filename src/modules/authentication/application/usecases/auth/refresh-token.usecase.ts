import { UseCaseInterface } from '@/core/application/use-case.interface';
import { AuthRepositoryInterface } from '@/modules/authentication/domain/repositories/auth-repository.interface';
import {
  InputRefreshTokenDto,
  OutputRefreshTokenDto,
} from '../../dtos/refresh-token.dto';

export class RefreshTokenUseCase
  implements UseCaseInterface<InputRefreshTokenDto, OutputRefreshTokenDto>
{
  constructor(private readonly authRepository: AuthRepositoryInterface) {}

  async execute(request: InputRefreshTokenDto): Promise<OutputRefreshTokenDto> {
    const authToken = await this.authRepository.refreshToken(request.refreshToken);

    return {
      accessToken: authToken.accessToken,
      refreshToken: authToken.refreshToken,
      expiresIn: authToken.expiresIn,
      tokenType: authToken.tokenType,
    };
  }
}
