import { NotFoundError, BadRequestError, UnauthorizedError } from './app.error';

describe('Application Errors', () => {
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
});

