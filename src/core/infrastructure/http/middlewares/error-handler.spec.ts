import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './error-handler';
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
} from '@/core/application/errors/app.error';

describe('errorHandler middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    
    mockRequest = {};
    mockResponse = {
      status: statusMock as any,
      json: jsonMock,
    };
    mockNext = jest.fn();
  });

  it('should handle BadRequestError with correct status code', () => {
    // Arrange
    const error = new BadRequestError('Invalid request data');

    // Act
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: expect.any(String),
        message: 'Invalid request data',
      },
    });
  });

  it('should handle UnauthorizedError with correct status code', () => {
    // Arrange
    const error = new UnauthorizedError('Authentication required');

    // Act
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: expect.any(String),
        message: 'Authentication required',
      },
    });
  });

  it('should handle ForbiddenError with correct status code', () => {
    // Arrange
    const error = new ForbiddenError('Access denied');

    // Act
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: expect.any(String),
        message: 'Access denied',
      },
    });
  });

  it('should handle NotFoundError with correct status code', () => {
    // Arrange
    const error = new NotFoundError('Resource not found');

    // Act
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: expect.any(String),
        message: 'Resource not found',
      },
    });
  });

  it('should handle InternalServerError with correct status code', () => {
    // Arrange
    const error = new InternalServerError('Server error');

    // Act
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: expect.any(String),
        message: 'Server error',
      },
    });
  });

  it('should handle generic Error with 500 status code', () => {
    // Arrange
    const error = new Error('Unexpected error');

    // Act
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      },
    });
  });

  it('should handle generic Error without exposing details', () => {
    // Arrange
    const error = new Error('Sensitive database error');

    // Act
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      },
    });
    // Should not expose the original error message
    expect(jsonMock).not.toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          message: 'Sensitive database error',
        }),
      })
    );
  });
});
