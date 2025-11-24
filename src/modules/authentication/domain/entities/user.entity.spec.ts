import { UserEntity, UserEntityProps, UserEntityFactory } from './user.entity';

jest.mock('uuid', () => ({
    v7: jest.fn(() => '550e8400-e29b-41d4-a716-446655440000'),
}));

describe('UserEntity', () => {
    const mockProps: UserEntityProps = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        cpf: '123.456.789-00',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    };

    it('should create a user entity with all properties', () => {
        const user = new UserEntity(mockProps);

        expect(user.id).toBe(mockProps.id);
        expect(user.cpf).toBe(mockProps.cpf);
        expect(user.email).toBe(mockProps.email);
        expect(user.firstName).toBe(mockProps.firstName);
        expect(user.lastName).toBe(mockProps.lastName);
        expect(user.createdAt).toEqual(mockProps.createdAt);
        expect(user.updatedAt).toEqual(mockProps.updatedAt);
    });

    it('should create user with optional fields undefined', () => {
        const minimalProps: UserEntityProps = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            cpf: '987.654.321-00',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const user = new UserEntity(minimalProps);

        expect(user.cpf).toBe(minimalProps.cpf);
        expect(user.email).toBeUndefined();
        expect(user.firstName).toBeUndefined();
        expect(user.lastName).toBeUndefined();
    });

    it('should inherit from BaseEntity', () => {
        const user = new UserEntity(mockProps);

        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('updatedAt');
    });
});

describe('UserEntityFactory', () => {
    it('should create a user with auto-generated UUID', () => {
        const props = {
            cpf: '111.222.333-44',
            email: 'test@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const user = UserEntityFactory.create(props);

        expect(user).toBeInstanceOf(UserEntity);
        expect(user.id).toBe('550e8400-e29b-41d4-a716-446655440000');
        expect(user.cpf).toBe(props.cpf);
        expect(user.email).toBe(props.email);
        expect(user.firstName).toBe(props.firstName);
        expect(user.lastName).toBe(props.lastName);
    });

    it('should create user without requiring id in props', () => {
        const props = {
            cpf: '555.666.777-88',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const user = UserEntityFactory.create(props);

        expect(user.id).toBeDefined();
        expect(user.id).toBe('550e8400-e29b-41d4-a716-446655440000');
        expect(user.cpf).toBe(props.cpf);
    });
});
