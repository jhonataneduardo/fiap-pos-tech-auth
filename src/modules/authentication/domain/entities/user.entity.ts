import { v7 as uuidv7 } from 'uuid';
import { BaseEntity, BaseEntityProps } from '@/core/domain/entities/base.entity';

export interface UserEntityProps extends BaseEntityProps {
    cpf: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}

export class UserEntity extends BaseEntity {
    public cpf: string;
    public email?: string;
    public firstName?: string;
    public lastName?: string;

    constructor(props: UserEntityProps) {
        super(props);
        this.cpf = props.cpf;
        this.email = props.email;
        this.firstName = props.firstName;
        this.lastName = props.lastName;
    }
}

export class UserEntityFactory {
    static create(props: Omit<UserEntityProps, 'id'>): UserEntity {
        const id = uuidv7();
        return new UserEntity({ ...props, id });
    }
}
