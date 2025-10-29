import { UserRepositoryInterface } from '@/modules/authentication/domain/repositories/user-repository.interface';
import { UserEntity, UserEntityFactory } from '@/modules/authentication/domain/entities/user.entity';
import { KeycloakService } from '../keycloak.service';

export class KeycloakUserRepository implements UserRepositoryInterface {
  constructor(private readonly keycloakService: KeycloakService) {}

  async createUser(
    cpf: string,
    password: string,
    email?: string,
    firstName?: string,
    lastName?: string
  ): Promise<UserEntity> {
    const keycloakUser = await this.keycloakService.createUser(
      cpf,
      password,
      email,
      firstName,
      lastName
    );

    return UserEntityFactory.create({
      cpf: keycloakUser.username,
      email: keycloakUser.email,
      firstName: keycloakUser.firstName,
      lastName: keycloakUser.lastName,
      createdAt: keycloakUser.createdTimestamp
        ? new Date(keycloakUser.createdTimestamp)
        : new Date(),
      updatedAt: new Date(),
    });
  }

  async findUserByCpf(cpf: string): Promise<UserEntity | null> {
    const keycloakUser = await this.keycloakService.findUserByCpf(cpf);

    if (!keycloakUser) {
      return null;
    }

    return UserEntityFactory.create({
      cpf: keycloakUser.username,
      email: keycloakUser.email,
      firstName: keycloakUser.firstName,
      lastName: keycloakUser.lastName,
      createdAt: keycloakUser.createdTimestamp
        ? new Date(keycloakUser.createdTimestamp)
        : new Date(),
      updatedAt: new Date(),
    });
  }
}
