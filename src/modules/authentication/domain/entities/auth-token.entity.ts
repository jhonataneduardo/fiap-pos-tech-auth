export interface AuthTokenEntityProps {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
}

export class AuthTokenEntity {
    public accessToken: string;
    public refreshToken: string;
    public expiresIn: number;
    public tokenType: string;

    constructor(props: AuthTokenEntityProps) {
        this.accessToken = props.accessToken;
        this.refreshToken = props.refreshToken;
        this.expiresIn = props.expiresIn;
        this.tokenType = props.tokenType;
    }
}
