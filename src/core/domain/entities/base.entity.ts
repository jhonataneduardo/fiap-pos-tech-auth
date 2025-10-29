export interface BaseEntityProps {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export abstract class BaseEntity {
    public id: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(props: BaseEntityProps) {
        this.id = props.id;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}
