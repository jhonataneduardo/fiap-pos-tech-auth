import { AuthTokenEntity, AuthTokenEntityProps } from './auth-token.entity';

describe('AuthTokenEntity', () => {
    const mockProps: AuthTokenEntityProps = {
        accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.refresh...',
        expiresIn: 3600,
        tokenType: 'Bearer',
    };

    it('should create an auth token entity with all properties', () => {
        const token = new AuthTokenEntity(mockProps);

        expect(token.accessToken).toBe(mockProps.accessToken);
        expect(token.refreshToken).toBe(mockProps.refreshToken);
        expect(token.expiresIn).toBe(mockProps.expiresIn);
        expect(token.tokenType).toBe(mockProps.tokenType);
    });

    it('should have correct token type', () => {
        const token = new AuthTokenEntity(mockProps);

        expect(token.tokenType).toBe('Bearer');
    });

    it('should have numeric expiresIn', () => {
        const token = new AuthTokenEntity(mockProps);

        expect(typeof token.expiresIn).toBe('number');
        expect(token.expiresIn).toBeGreaterThan(0);
    });

    it('should store different token types', () => {
        const props = {
            ...mockProps,
            tokenType: 'Custom',
        };

        const token = new AuthTokenEntity(props);

        expect(token.tokenType).toBe('Custom');
    });
});
