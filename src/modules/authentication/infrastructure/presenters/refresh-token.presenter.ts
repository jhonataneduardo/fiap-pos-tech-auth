import { OutputRefreshTokenDto } from '../../application/dtos/refresh-token.dto';

export class RefreshTokenPresenter {
  static present(tokenData: OutputRefreshTokenDto) {
    return {
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      expiresIn: tokenData.expiresIn,
      tokenType: tokenData.tokenType,
    };
  }
}
