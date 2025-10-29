import { UseCaseInterface } from '@/core/application/use-case.interface';
import { AuthRepositoryInterface } from '@/modules/authentication/domain/repositories/auth-repository.interface';
import { InputLogoutDto } from '../../dtos/logout.dto';

export class LogoutUseCase implements UseCaseInterface<InputLogoutDto, void> {
  constructor(private readonly authRepository: AuthRepositoryInterface) {}

  async execute(request: InputLogoutDto): Promise<void> {
    await this.authRepository.logout(request.refreshToken);
  }
}
