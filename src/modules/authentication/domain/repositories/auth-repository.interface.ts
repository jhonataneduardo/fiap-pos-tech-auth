import { AuthTokenEntity } from '../entities/auth-token.entity';

export interface AuthRepositoryInterface {
    login(cpf: string, password: string): Promise<AuthTokenEntity>;

    refreshToken(refreshToken: string): Promise<AuthTokenEntity>;

    logout(refreshToken: string): Promise<void>;
}
