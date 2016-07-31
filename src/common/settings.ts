import { setStorage, StorageInterface } from "../auth/storage";
import { setUrl } from "../common/request";
import { Id } from "../common/structures";

export type Versions = "1";

export default class Settings {
    static version: Versions = "1";

    static team: Id | undefined = undefined;

    static cache = {
        use: true,
        timeout: 1000
    };

    static auth = {
        tokenUrl: "https://api.cycle.io:14000/oauth2/token",
        refreshUrl: "https://api.cycle.io:14000/oauth2/token"
    };

    private static _url = `https://api.cycle.io`;

    static get url() {
        return this._url;
    }

    static set url(url: string) {
        this._url = url + `/v${this.version}/`;
        setUrl(this._url);
    }

    public static setTokenStorage(s: StorageInterface) {
        setStorage(s);
    }
}
