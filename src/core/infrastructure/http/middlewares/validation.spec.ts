import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { validate } from './validation';

describe('validate middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));

    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: statusMock as any,
      json: jsonMock,
    };
    mockNext = jest.fn();
  });

  it('should validate and pass valid data', async () => {
    // Arrange
    const schema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    mockRequest.body = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const middleware = validate(schema);

    // Act
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
  });

  it('should reject invalid data and return validation errors', async () => {
    // Arrange
    const schema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
    });

    mockRequest.body = {
      name: 'Jo', // Too short
      email: 'invalid-email', // Invalid email
    };

    const middleware = validate(schema);

    // Act
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Erro de validação',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: expect.any(String),
            message: expect.any(String),
          }),
        ]),
      },
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject missing required fields', async () => {
    // Arrange
    const schema = z.object({
      cpf: z.string(),
      password: z.string().min(6),
    });

    mockRequest.body = {};

    const middleware = validate(schema);

    // Act
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Erro de validação',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'cpf',
            message: expect.any(String),
          }),
          expect.objectContaining({
            field: 'password',
            message: expect.any(String),
          }),
        ]),
      },
    });
  });

  it('should update request body with validated data', async () => {
    // Arrange
    const schema = z.object({
      age: z.string().transform((val) => parseInt(val)),
      active: z.string().transform((val) => val === 'true'),
    });

    mockRequest.body = {
      age: '25',
      active: 'true',
    };

    const middleware = validate(schema);

    // Act
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(mockRequest.body).toEqual({
      age: 25,
      active: true,
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle nested validation errors', async () => {
    // Arrange
    const schema = z.object({
      user: z.object({
        name: z.string(),
        address: z.object({
          street: z.string(),
          city: z.string(),
        }),
      }),
    });

    mockRequest.body = {
      user: {
        name: 'John',
        address: {
          street: '', // Invalid
        },
      },
    };

    const middleware = validate(schema);

    // Act
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'VALIDATION_ERROR',
          details: expect.any(Array),
        }),
      })
    );
  });
});
