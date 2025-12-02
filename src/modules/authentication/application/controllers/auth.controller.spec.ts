import { AuthController } from './auth.controller';
import { RegisterUserUseCase } from '../usecases/user/register-user.usecase';
import { LoginUseCase } from '../usecases/auth/login.usecase';
import { RefreshTokenUseCase } from '../usecases/auth/refresh-token.usecase';
import { LogoutUseCase } from '../usecases/auth/logout.usecase';
import {
  InputRegisterUserDto,
  OutputRegisterUserDto,
} from '../dtos/register-user.dto';
import { InputLoginDto, OutputLoginDto } from '../dtos/login.dto';
import { InputRefreshTokenDto, OutputRefreshTokenDto } from '../dtos/refresh-token.dto';
import { InputLogoutDto } from '../dtos/logout.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let mockRegisterUserUseCase: jest.Mocked<RegisterUserUseCase>;
  let mockLoginUseCase: jest.Mocked<LoginUseCase>;
  let mockRefreshTokenUseCase: jest.Mocked<RefreshTokenUseCase>;
  let mockLogoutUseCase: jest.Mocked<LogoutUseCase>;

  beforeEach(() => {
    mockRegisterUserUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RegisterUserUseCase>;

    mockLoginUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<LoginUseCase>;

    mockRefreshTokenUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RefreshTokenUseCase>;

    mockLogoutUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<LogoutUseCase>;

    authController = new AuthController(
      mockRegisterUserUseCase,
      mockLoginUseCase,
      mockRefreshTokenUseCase,
      mockLogoutUseCase
    );
  });

  describe('registerUser', () => {
    it('should delegate to RegisterUserUseCase', async () => {
      // Arrange
      const input: InputRegisterUserDto = {
        cpf: '12345678900',
        password: 'password123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const expectedOutput: OutputRegisterUserDto = {
        id: 'user-123',
        cpf: '12345678900',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRegisterUserUseCase.execute.mockResolvedValue(expectedOutput);

      // Act
      const result = await authController.registerUser(input);

      // Assert
      expect(mockRegisterUserUseCase.execute).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedOutput);
    });

    it('should propagate errors from RegisterUserUseCase', async () => {
      // Arrange
      const input: InputRegisterUserDto = {
        cpf: '12345678900',
        password: 'password123',
        email: 'test@example.com',
      };

      mockRegisterUserUseCase.execute.mockRejectedValue(new Error('Registration failed'));

      // Act & Assert
      await expect(authController.registerUser(input)).rejects.toThrow('Registration failed');
    });
  });

  describe('login', () => {
    it('should delegate to LoginUseCase', async () => {
      // Arrange
      const input: InputLoginDto = {
        cpf: '12345678900',
        password: 'password123',
      };

      const expectedOutput: OutputLoginDto = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600,
        tokenType: 'Bearer',
        user: {
          id: 'user-123',
          cpf: '12345678900',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      mockLoginUseCase.execute.mockResolvedValue(expectedOutput);

      // Act
      const result = await authController.login(input);

      // Assert
      expect(mockLoginUseCase.execute).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedOutput);
    });

    it('should propagate errors from LoginUseCase', async () => {
      // Arrange
      const input: InputLoginDto = {
        cpf: '12345678900',
        password: 'wrong-password',
      };

      mockLoginUseCase.execute.mockRejectedValue(new Error('Invalid credentials'));

      // Act & Assert
      await expect(authController.login(input)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('refreshToken', () => {
    it('should delegate to RefreshTokenUseCase', async () => {
      // Arrange
      const input: InputRefreshTokenDto = {
        refreshToken: 'valid-refresh-token',
      };

      const expectedOutput: OutputRefreshTokenDto = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 3600,
        tokenType: 'Bearer',
      };

      mockRefreshTokenUseCase.execute.mockResolvedValue(expectedOutput);

      // Act
      const result = await authController.refreshToken(input);

      // Assert
      expect(mockRefreshTokenUseCase.execute).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedOutput);
    });

    it('should propagate errors from RefreshTokenUseCase', async () => {
      // Arrange
      const input: InputRefreshTokenDto = {
        refreshToken: 'invalid-token',
      };

      mockRefreshTokenUseCase.execute.mockRejectedValue(new Error('Invalid refresh token'));

      // Act & Assert
      await expect(authController.refreshToken(input)).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('logout', () => {
    it('should delegate to LogoutUseCase', async () => {
      // Arrange
      const input: InputLogoutDto = {
        refreshToken: 'valid-refresh-token',
      };

      mockLogoutUseCase.execute.mockResolvedValue(undefined);

      // Act
      await authController.logout(input);

      // Assert
      expect(mockLogoutUseCase.execute).toHaveBeenCalledWith(input);
    });

    it('should propagate errors from LogoutUseCase', async () => {
      // Arrange
      const input: InputLogoutDto = {
        refreshToken: 'invalid-token',
      };

      mockLogoutUseCase.execute.mockRejectedValue(new Error('Logout failed'));

      // Act & Assert
      await expect(authController.logout(input)).rejects.toThrow('Logout failed');
    });
  });
});
