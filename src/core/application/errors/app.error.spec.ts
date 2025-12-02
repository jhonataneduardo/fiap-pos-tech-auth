import {
  AppError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError,
  InvalidCredentialsError,
  InvalidTokenError,
  UserAlreadyExistsError,
} from './app.error';

describe('Application Errors', () => {
  describe('AppError', () => {
    it('should create error with message and default status code', () => {
      const error = new AppError('Custom error');

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Custom error');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });

    it('should create error with custom status code', () => {
      const error = new AppError('Custom error', 418);

      expect(error.statusCode).toBe(418);
    });

    it('should create error with non-operational flag', () => {
      const error = new AppError('Critical error', 500, false);

      expect(error.isOperational).toBe(false);
    });
  });

  describe('NotFoundError', () => {
    it('should create error with default message', () => {
      const error = new NotFoundError();

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Not Found');
    });

    it('should create error with custom message', () => {
      const customMessage = 'User not found';
      const error = new NotFoundError(customMessage);

      expect(error.message).toBe(customMessage);
    });

    it('should have status code 404', () => {
      const error = new NotFoundError();

      expect(error.statusCode).toBe(404);
    });
  });

  describe('BadRequestError', () => {
    it('should create error with default message', () => {
      const error = new BadRequestError();

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Bad Request');
    });

    it('should create error with custom message', () => {
      const customMessage = 'Invalid CPF format';
      const error = new BadRequestError(customMessage);

      expect(error.message).toBe(customMessage);
    });

    it('should have status code 400', () => {
      const error = new BadRequestError();

      expect(error.statusCode).toBe(400);
    });
  });

  describe('UnauthorizedError', () => {
    it('should create error with default message', () => {
      const error = new UnauthorizedError();

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Unauthorized');
    });

    it('should create error with custom message', () => {
      const customMessage = 'Invalid credentials';
      const error = new UnauthorizedError(customMessage);

      expect(error.message).toBe(customMessage);
    });

    it('should have status code 401', () => {
      const error = new UnauthorizedError();

      expect(error.statusCode).toBe(401);
    });
  });

  describe('ForbiddenError', () => {
    it('should create error with default message', () => {
      const error = new ForbiddenError();

      expect(error.message).toBe('Forbidden');
      expect(error.statusCode).toBe(403);
    });

    it('should create error with custom message', () => {
      const error = new ForbiddenError('Access denied');

      expect(error.message).toBe('Access denied');
    });
  });

  describe('ConflictError', () => {
    it('should create error with default message', () => {
      const error = new ConflictError();

      expect(error.message).toBe('Conflict');
      expect(error.statusCode).toBe(409);
    });

    it('should create error with custom message', () => {
      const error = new ConflictError('Resource already exists');

      expect(error.message).toBe('Resource already exists');
    });
  });

  describe('InternalServerError', () => {
    it('should create error with default message', () => {
      const error = new InternalServerError();

      expect(error.message).toBe('Internal Server Error');
      expect(error.statusCode).toBe(500);
    });

    it('should create error with custom message', () => {
      const error = new InternalServerError('Database connection failed');

      expect(error.message).toBe('Database connection failed');
    });
  });

  describe('InvalidCredentialsError', () => {
    it('should create error with default message', () => {
      const error = new InvalidCredentialsError();

      expect(error.message).toBe('Invalid credentials');
      expect(error.statusCode).toBe(401);
    });

    it('should create error with custom message', () => {
      const error = new InvalidCredentialsError('Wrong password');

      expect(error.message).toBe('Wrong password');
    });
  });

  describe('InvalidTokenError', () => {
    it('should create error with default message', () => {
      const error = new InvalidTokenError();

      expect(error.message).toBe('Invalid token');
      expect(error.statusCode).toBe(401);
    });

    it('should create error with custom message', () => {
      const error = new InvalidTokenError('Token expired');

      expect(error.message).toBe('Token expired');
    });
  });

  describe('UserAlreadyExistsError', () => {
    it('should create error with default message', () => {
      const error = new UserAlreadyExistsError();

      expect(error.message).toBe('User already exists');
      expect(error.statusCode).toBe(409);
    });

    it('should create error with custom message', () => {
      const error = new UserAlreadyExistsError('CPF already registered');

      expect(error.message).toBe('CPF already registered');
    });
  });
});
