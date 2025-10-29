import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/core/application/errors/app.error';
import config from '@/config/index';

/**
 * Middleware global de tratamento de erros
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.constructor.name.replace('Error', '').toUpperCase(),
        message: error.message,
      },
    });
    return;
  }

  // Log do erro para debug em desenvolvimento
  if (config.nodeEnv === 'development') {
    console.error('Unhandled error:', error);
  }

  // Erro genérico para erros não tratados
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: config.nodeEnv === 'development'
        ? error.message
        : 'Erro interno do servidor',
    },
  });
};

/**
 * Middleware para rotas não encontradas (404)
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Rota ${req.method} ${req.path} não encontrada`,
    },
  });
};
