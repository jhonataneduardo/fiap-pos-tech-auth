import { UserEntity } from '../entities/user.entity';

export interface UserRepositoryInterface {
    createUser(
        cpf: string,
        password: string,
        email?: string,
        firstName?: string,
        lastName?: string
    ): Promise<UserEntity>;

    findUserByCpf(cpf: string): Promise<UserEntity | null>;
}
