import jwt from 'jsonwebtoken';
import { InvalidTokenError } from '@/core/application/errors/app.error';

export interface DecodedToken {
  sub: string;
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export class TokenService {
  /**
   * Decodifica um JWT sem validar a assinatura (apenas para leitura)
   * IMPORTANTE: Não use para validação de segurança
   */
  decodeToken(token: string): DecodedToken {
    try {
      const decoded = jwt.decode(token) as DecodedToken;

      if (!decoded) {
        throw new InvalidTokenError('Token inválido');
      }

      return decoded;
    } catch (error) {
      throw new InvalidTokenError('Erro ao decodificar token');
    }
  }

  /**
   * Verifica se um token está expirado
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);

      if (!decoded.exp) {
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Extrai o tempo restante até a expiração do token em segundos
   */
  getTimeUntilExpiration(token: string): number {
    try {
      const decoded = this.decodeToken(token);

      if (!decoded.exp) {
        return 0;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const timeRemaining = decoded.exp - currentTime;

      return Math.max(0, timeRemaining);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Extrai informações do usuário do token
   */
  extractUserInfo(token: string): {
    userId: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  } {
    try {
      const decoded = this.decodeToken(token);

      return {
        userId: decoded.sub,
        username: decoded.preferred_username,
        email: decoded.email,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
      };
    } catch (error) {
      throw new InvalidTokenError('Erro ao extrair informações do token');
    }
  }
}

export default new TokenService();
