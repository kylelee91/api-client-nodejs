export default class Client {
    protected static client_id: string;
    protected static client_secret: string;
    
    public static get id() {
        return this.client_id;
    }
    
    public static set id(id: string) {
        this.client_id = id;
    }
    
    public static get secret() {
        return this.client_secret;
    }
    
    public static set secret(s: string) {
        this.client_secret = s;
    }
}
