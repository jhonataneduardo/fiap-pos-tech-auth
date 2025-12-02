import { RefreshTokenPresenter } from './refresh-token.presenter';
import { OutputRefreshTokenDto } from '../../application/dtos/refresh-token.dto';

describe('RefreshTokenPresenter', () => {
  it('should present refresh token data', () => {
    // Arrange
    const refreshTokenData: OutputRefreshTokenDto = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      expiresIn: 3600,
      tokenType: 'Bearer',
    };

    // Act
    const result = RefreshTokenPresenter.present(refreshTokenData);

    // Assert
    expect(result).toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      expiresIn: 3600,
      tokenType: 'Bearer',
    });
  });

  it('should preserve all token properties', () => {
    // Arrange
    const refreshTokenData: OutputRefreshTokenDto = {
      accessToken: 'token-abc-123',
      refreshToken: 'refresh-xyz-456',
      expiresIn: 7200,
      tokenType: 'Bearer',
    };

    // Act
    const result = RefreshTokenPresenter.present(refreshTokenData);

    // Assert
    expect(result.accessToken).toBe('token-abc-123');
    expect(result.refreshToken).toBe('refresh-xyz-456');
    expect(result.expiresIn).toBe(7200);
    expect(result.tokenType).toBe('Bearer');
  });
});
