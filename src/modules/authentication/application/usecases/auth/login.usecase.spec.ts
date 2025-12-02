import { LoginUseCase } from './login.usecase';
import { AuthRepositoryInterface } from '@/modules/authentication/domain/repositories/auth-repository.interface';
import { UserRepositoryInterface } from '@/modules/authentication/domain/repositories/user-repository.interface';
import { AuthTokenEntity } from '@/modules/authentication/domain/entities/auth-token.entity';
import { UserEntityFactory } from '@/modules/authentication/domain/entities/user.entity';
import { InputLoginDto } from '../../dtos/login.dto';

jest.mock('uuid', () => ({
  v7: jest.fn(() => '550e8400-e29b-41d4-a716-446655440000'),
}));

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockAuthRepository: jest.Mocked<AuthRepositoryInterface>;
  let mockUserRepository: jest.Mocked<UserRepositoryInterface>;

  beforeEach(() => {
    mockAuthRepository = {
      login: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    } as jest.Mocked<AuthRepositoryInterface>;

    mockUserRepository = {
      createUser: jest.fn(),
      findUserByCpf: jest.fn(),
      findUserById: jest.fn(),
    } as jest.Mocked<UserRepositoryInterface>;

    loginUseCase = new LoginUseCase(mockAuthRepository, mockUserRepository);
  });

  it('should successfully login with valid credentials', async () => {
    // Arrange
    const input: InputLoginDto = {
      cpf: '12345678900',
      password: 'password123',
    };

    const mockAuthToken = new AuthTokenEntity({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600,
      tokenType: 'Bearer',
    });

    const mockUser = UserEntityFactory.create({
      cpf: '12345678900',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockAuthRepository.login.mockResolvedValue(mockAuthToken);
    mockUserRepository.findUserByCpf.mockResolvedValue(mockUser);

    // Act
    const result = await loginUseCase.execute(input);

    // Assert
    expect(mockAuthRepository.login).toHaveBeenCalledWith('12345678900', 'password123');
    expect(mockUserRepository.findUserByCpf).toHaveBeenCalledWith('12345678900');
    expect(result).toEqual({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600,
      tokenType: 'Bearer',
      user: {
        id: mockUser.id,
        cpf: '12345678900',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
    });
  });

  it('should login successfully even when user is not found', async () => {
    // Arrange
    const input: InputLoginDto = {
      cpf: '12345678900',
      password: 'password123',
    };

    const mockAuthToken = new AuthTokenEntity({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600,
      tokenType: 'Bearer',
    });

    mockAuthRepository.login.mockResolvedValue(mockAuthToken);
    mockUserRepository.findUserByCpf.mockResolvedValue(null);

    // Act
    const result = await loginUseCase.execute(input);

    // Assert
    expect(result.user).toEqual({
      id: '',
      cpf: '12345678900',
      email: undefined,
      firstName: undefined,
      lastName: undefined,
    });
  });

  it('should propagate error when authentication fails', async () => {
    // Arrange
    const input: InputLoginDto = {
      cpf: '12345678900',
      password: 'wrong-password',
    };

    mockAuthRepository.login.mockRejectedValue(new Error('Invalid credentials'));

    // Act & Assert
    await expect(loginUseCase.execute(input)).rejects.toThrow('Invalid credentials');
    expect(mockAuthRepository.login).toHaveBeenCalledWith('12345678900', 'wrong-password');
    expect(mockUserRepository.findUserByCpf).not.toHaveBeenCalled();
  });

  it('should propagate error when user repository fails', async () => {
    // Arrange
    const input: InputLoginDto = {
      cpf: '12345678900',
      password: 'password123',
    };

    const mockAuthToken = new AuthTokenEntity({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600,
      tokenType: 'Bearer',
    });

    mockAuthRepository.login.mockResolvedValue(mockAuthToken);
    mockUserRepository.findUserByCpf.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(loginUseCase.execute(input)).rejects.toThrow('Database error');
  });
});
