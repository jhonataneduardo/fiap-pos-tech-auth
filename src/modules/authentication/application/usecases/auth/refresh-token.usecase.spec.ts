import { RefreshTokenUseCase } from './refresh-token.usecase';
import { AuthRepositoryInterface } from '@/modules/authentication/domain/repositories/auth-repository.interface';
import { AuthTokenEntity } from '@/modules/authentication/domain/entities/auth-token.entity';
import { InputRefreshTokenDto } from '../../dtos/refresh-token.dto';

describe('RefreshTokenUseCase', () => {
  let refreshTokenUseCase: RefreshTokenUseCase;
  let mockAuthRepository: jest.Mocked<AuthRepositoryInterface>;

  beforeEach(() => {
    mockAuthRepository = {
      login: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    } as jest.Mocked<AuthRepositoryInterface>;

    refreshTokenUseCase = new RefreshTokenUseCase(mockAuthRepository);
  });

  it('should successfully refresh token with valid refresh token', async () => {
    // Arrange
    const input: InputRefreshTokenDto = {
      refreshToken: 'valid-refresh-token',
    };

    const mockAuthToken = new AuthTokenEntity({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      expiresIn: 3600,
      tokenType: 'Bearer',
    });

    mockAuthRepository.refreshToken.mockResolvedValue(mockAuthToken);

    // Act
    const result = await refreshTokenUseCase.execute(input);

    // Assert
    expect(mockAuthRepository.refreshToken).toHaveBeenCalledWith('valid-refresh-token');
    expect(result).toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      expiresIn: 3600,
      tokenType: 'Bearer',
    });
  });

  it('should propagate error when refresh token is invalid', async () => {
    // Arrange
    const input: InputRefreshTokenDto = {
      refreshToken: 'invalid-refresh-token',
    };

    mockAuthRepository.refreshToken.mockRejectedValue(new Error('Invalid refresh token'));

    // Act & Assert
    await expect(refreshTokenUseCase.execute(input)).rejects.toThrow('Invalid refresh token');
    expect(mockAuthRepository.refreshToken).toHaveBeenCalledWith('invalid-refresh-token');
  });

  it('should propagate error when refresh token is expired', async () => {
    // Arrange
    const input: InputRefreshTokenDto = {
      refreshToken: 'expired-refresh-token',
    };

    mockAuthRepository.refreshToken.mockRejectedValue(new Error('Token expired'));

    // Act & Assert
    await expect(refreshTokenUseCase.execute(input)).rejects.toThrow('Token expired');
  });
});
