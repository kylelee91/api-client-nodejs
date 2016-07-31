export interface TokenInterface {
    access_token: string;
    token_type: string;
    expires_in: number;
    created: number;
    refresh_token: string;
}

export default class Token implements TokenInterface {
    public access_token: string;
    public token_type: string;
    public expires_in: number;
    public created: number;
    public refresh_token: string;
    
    constructor(token: TokenInterface) {
        this.access_token = token.access_token;
        this.token_type = token.token_type;
        this.expires_in = token.expires_in;
        this.created = token.created;
        this.refresh_token = token.refresh_token;

        if (this.created === undefined) {
            this.created = Math.floor(Date.now() / 1000);
        }
    }
}
