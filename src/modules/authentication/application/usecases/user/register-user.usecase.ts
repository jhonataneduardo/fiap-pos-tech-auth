import { UseCaseInterface } from '@/core/application/use-case.interface';
import { UserRepositoryInterface } from '@/modules/authentication/domain/repositories/user-repository.interface';
import { InputRegisterUserDto, OutputRegisterUserDto } from '../../dtos/register-user.dto';

export class RegisterUserUseCase
  implements UseCaseInterface<InputRegisterUserDto, OutputRegisterUserDto>
{
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(request: InputRegisterUserDto): Promise<OutputRegisterUserDto> {
    const user = await this.userRepository.createUser(
      request.cpf,
      request.password,
      request.email,
      request.firstName,
      request.lastName
    );

    return {
      id: user.id,
      cpf: user.cpf,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
