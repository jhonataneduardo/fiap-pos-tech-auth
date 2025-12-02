import { RegisterUserPresenter } from './register-user.presenter';
import { OutputRegisterUserDto } from '../../application/dtos/register-user.dto';

describe('RegisterUserPresenter', () => {
  it('should present registered user data with all fields', () => {
    // Arrange
    const userData: OutputRegisterUserDto = {
      id: 'user-123',
      cpf: '12345678900',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    };

    // Act
    const result = RegisterUserPresenter.present(userData);

    // Assert
    expect(result).toEqual({
      id: 'user-123',
      username: '12345678900',
      cpf: '12345678900',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    });
  });

  it('should present user data with optional fields undefined', () => {
    // Arrange
    const userData: OutputRegisterUserDto = {
      id: 'user-456',
      cpf: '98765432100',
      email: 'minimal@example.com',
      firstName: undefined,
      lastName: undefined,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    };

    // Act
    const result = RegisterUserPresenter.present(userData);

    // Assert
    expect(result.id).toBe('user-456');
    expect(result.username).toBe('98765432100');
    expect(result.cpf).toBe('98765432100');
    expect(result.email).toBe('minimal@example.com');
    expect(result.firstName).toBeUndefined();
    expect(result.lastName).toBeUndefined();
    expect(result.createdAt).toEqual(new Date('2024-01-01T00:00:00.000Z'));
    expect(result.updatedAt).toEqual(new Date('2024-01-01T00:00:00.000Z'));
  });
});
