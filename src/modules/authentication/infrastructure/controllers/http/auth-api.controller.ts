import { Request, Response, NextFunction } from 'express';
import { container } from '@/core/infrastructure/di/container';
import { AuthController } from '@/modules/authentication/application/controllers/auth.controller';
import { RegisterUserPresenter } from '../../presenters/register-user.presenter';
import { LoginPresenter } from '../../presenters/login.presenter';
import { RefreshTokenPresenter } from '../../presenters/refresh-token.presenter';

/**
 * AuthApiController (HTTP Adapter)
 *
 * Controller da camada de infraestrutura que adapta HTTP (Express) para Clean Architecture.
 * Responsável por:
 * - Extrair dados do Request (body, params, query)
 * - Delegar processamento para o AuthController (Clean)
 * - Formatar Response HTTP com status codes adequados
 */
export class AuthApiController {
  /**
   * POST /auth/register - Registra um novo usuário
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authController = container.resolve<AuthController>('AuthController');

      const input = {
        cpf: req.body.cpf,
        password: req.body.password,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      };

      const user = await authController.registerUser(input);
      const viewModel = RegisterUserPresenter.present(user);

      res.status(201).json({
        success: true,
        data: {
          user: viewModel,
          message: 'Usuário criado com sucesso',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/login - Realiza login do usuário
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authController = container.resolve<AuthController>('AuthController');

      const input = {
        cpf: req.body.cpf,
        password: req.body.password,
      };

      const loginData = await authController.login(input);
      const viewModel = LoginPresenter.present(loginData);

      res.status(200).json({
        success: true,
        data: viewModel,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/refresh - Renova o access token
   */
  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authController = container.resolve<AuthController>('AuthController');

      const input = {
        refreshToken: req.body.refreshToken,
      };

      const tokenData = await authController.refreshToken(input);
      const viewModel = RefreshTokenPresenter.present(tokenData);

      res.status(200).json({
        success: true,
        data: viewModel,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/logout - Realiza logout do usuário
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authController = container.resolve<AuthController>('AuthController');

      const input = {
        refreshToken: req.body.refreshToken,
      };

      await authController.logout(input);

      res.status(200).json({
        success: true,
        data: {
          message: 'Logout realizado com sucesso',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /health - Health check
   */
  static async health(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: {
          status: 'ok',
          timestamp: new Date().toISOString(),
          service: 'fiap-pos-tech-auth',
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
