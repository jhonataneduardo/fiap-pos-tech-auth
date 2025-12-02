import { RegisterUserUseCase } from './register-user.usecase';
import { UserRepositoryInterface } from '@/modules/authentication/domain/repositories/user-repository.interface';
import { UserEntityFactory } from '@/modules/authentication/domain/entities/user.entity';
import { InputRegisterUserDto } from '../../dtos/register-user.dto';

jest.mock('uuid', () => ({
  v7: jest.fn(() => '550e8400-e29b-41d4-a716-446655440000'),
}));

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepositoryInterface>;

  beforeEach(() => {
    mockUserRepository = {
      createUser: jest.fn(),
      findUserByCpf: jest.fn(),
      findUserById: jest.fn(),
    } as jest.Mocked<UserRepositoryInterface>;

    registerUserUseCase = new RegisterUserUseCase(mockUserRepository);
  });

  it('should successfully register a new user with all fields', async () => {
    // Arrange
    const input: InputRegisterUserDto = {
      cpf: '12345678900',
      password: 'password123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    const mockUser = UserEntityFactory.create({
      cpf: '12345678900',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockUserRepository.createUser.mockResolvedValue(mockUser);

    // Act
    const result = await registerUserUseCase.execute(input);

    // Assert
    expect(mockUserRepository.createUser).toHaveBeenCalledWith(
      '12345678900',
      'password123',
      'test@example.com',
      'John',
      'Doe'
    );
    expect(result).toEqual({
      id: mockUser.id,
      cpf: '12345678900',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    });
  });

  it('should successfully register a user with only required fields', async () => {
    // Arrange
    const input: InputRegisterUserDto = {
      cpf: '98765432100',
      password: 'password456',
      email: 'minimal@example.com',
    };

    const mockUser = UserEntityFactory.create({
      cpf: '98765432100',
      email: 'minimal@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockUserRepository.createUser.mockResolvedValue(mockUser);

    // Act
    const result = await registerUserUseCase.execute(input);

    // Assert
    expect(mockUserRepository.createUser).toHaveBeenCalledWith(
      '98765432100',
      'password456',
      'minimal@example.com',
      undefined,
      undefined
    );
    expect(result.cpf).toBe('98765432100');
    expect(result.email).toBe('minimal@example.com');
  });

  it('should propagate error when user already exists', async () => {
    // Arrange
    const input: InputRegisterUserDto = {
      cpf: '12345678900',
      password: 'password123',
      email: 'existing@example.com',
    };

    mockUserRepository.createUser.mockRejectedValue(new Error('User already exists'));

    // Act & Assert
    await expect(registerUserUseCase.execute(input)).rejects.toThrow('User already exists');
    expect(mockUserRepository.createUser).toHaveBeenCalled();
  });

  it('should propagate error when repository fails', async () => {
    // Arrange
    const input: InputRegisterUserDto = {
      cpf: '12345678900',
      password: 'password123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    mockUserRepository.createUser.mockRejectedValue(new Error('Database connection error'));

    // Act & Assert
    await expect(registerUserUseCase.execute(input)).rejects.toThrow('Database connection error');
  });
});
