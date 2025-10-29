import { OutputRegisterUserDto } from '../../application/dtos/register-user.dto';

export class RegisterUserPresenter {
  static present(user: OutputRegisterUserDto) {
    return {
      id: user.id,
      username: user.cpf,
      cpf: user.cpf,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
