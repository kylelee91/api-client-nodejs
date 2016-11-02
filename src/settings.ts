import { StorageInterface, CacheStorage } from "./auth/storage";
import { Client } from "./auth/client";
import { ResourceId } from "./common/structures";

export type Version = 1;

export class Settings {
    version: Version = 1;
    team: ResourceId | undefined = undefined;
    cache = {
        use: true,
        refresh: 1000,
    };
    auth = {
        tokenUrl: "https://api.cycle.io:14000/oauth2/token",
        refreshUrl: "https://api.cycle.io:14000/oauth2/refresh",
    };
    client: Client | undefined;
    storage: StorageInterface = new CacheStorage();
    url = "https://api.cycle.io";
    autoRefreshToken = true;
};

export default new Settings();
