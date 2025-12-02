import { LogoutUseCase } from './logout.usecase';
import { AuthRepositoryInterface } from '@/modules/authentication/domain/repositories/auth-repository.interface';
import { InputLogoutDto } from '../../dtos/logout.dto';

describe('LogoutUseCase', () => {
    let useCase: LogoutUseCase;
    let mockAuthRepository: jest.Mocked<AuthRepositoryInterface>;

    beforeEach(() => {
        mockAuthRepository = {
            login: jest.fn(),
            logout: jest.fn(),
            refreshToken: jest.fn(),
        } as any;

        useCase = new LogoutUseCase(mockAuthRepository);
    });

    it('should logout successfully', async () => {
        const input: InputLogoutDto = {
            refreshToken: 'refresh-token-123',
        };

        mockAuthRepository.logout.mockResolvedValue(undefined);

        await useCase.execute(input);

        expect(mockAuthRepository.logout).toHaveBeenCalledWith(input.refreshToken);
    });

    it('should propagate logout errors', async () => {
        const input: InputLogoutDto = {
            refreshToken: 'invalid-token',
        };

        const error = new Error('Invalid token');
        mockAuthRepository.logout.mockRejectedValue(error);

        await expect(useCase.execute(input)).rejects.toThrow('Invalid token');
    });
});
