import { BaseEntity, BaseEntityProps } from './base.entity';

// Concrete implementation for testing
class TestEntity extends BaseEntity {
    constructor(props: BaseEntityProps) {
        super(props);
    }
}

describe('BaseEntity', () => {
    const mockProps: BaseEntityProps = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    };

    it('should create an entity with correct properties', () => {
        const entity = new TestEntity(mockProps);

        expect(entity.id).toBe(mockProps.id);
        expect(entity.createdAt).toEqual(mockProps.createdAt);
        expect(entity.updatedAt).toEqual(mockProps.updatedAt);
    });

    it('should allow updating createdAt and updatedAt', () => {
        const entity = new TestEntity(mockProps);
        const newDate = new Date('2024-01-03T00:00:00.000Z');

        entity.createdAt = newDate;
        entity.updatedAt = newDate;

        expect(entity.createdAt).toEqual(newDate);
        expect(entity.updatedAt).toEqual(newDate);
    });

    it('should preserve all properties from constructor', () => {
        const entity = new TestEntity(mockProps);

        expect(entity).toMatchObject(mockProps);
    });
});
