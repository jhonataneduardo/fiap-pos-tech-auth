import { OutputLoginDto } from '../../application/dtos/login.dto';

export class LoginPresenter {
  static present(loginData: OutputLoginDto) {
    return {
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken,
      expiresIn: loginData.expiresIn,
      tokenType: loginData.tokenType,
      user: loginData.user,
    };
  }
}
