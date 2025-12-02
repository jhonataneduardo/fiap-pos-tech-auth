import { LoginPresenter } from './login.presenter';
import { OutputLoginDto } from '../../application/dtos/login.dto';

describe('LoginPresenter', () => {
  it('should present login data with all fields', () => {
    // Arrange
    const loginData: OutputLoginDto = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
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

    // Act
    const result = LoginPresenter.present(loginData);

    // Assert
    expect(result).toEqual({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600,
      tokenType: 'Bearer',
      user: {
        id: 'user-123',
        cpf: '12345678900',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
    });
  });

  it('should present login data with minimal user information', () => {
    // Arrange
    const loginData: OutputLoginDto = {
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-456',
      expiresIn: 1800,
      tokenType: 'Bearer',
      user: {
        id: 'user-456',
        cpf: '98765432100',
        email: undefined,
        firstName: undefined,
        lastName: undefined,
      },
    };

    // Act
    const result = LoginPresenter.present(loginData);

    // Assert
    expect(result.accessToken).toBe('access-token-123');
    expect(result.user.id).toBe('user-456');
    expect(result.user.cpf).toBe('98765432100');
    expect(result.user.email).toBeUndefined();
    expect(result.user.firstName).toBeUndefined();
    expect(result.user.lastName).toBeUndefined();
  });
});
