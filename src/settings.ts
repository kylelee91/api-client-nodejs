import { StorageInterface, CacheStorage } from "./auth/storage";
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
        tokenUrl: "https://portal.cycle.io/auth/token",
        refreshUrl: "https://portal.cycle.io/auth/token",
    };
    storage: StorageInterface = new CacheStorage();
    url = "https://api.cycle.io";
    autoRefreshToken = true;
};

export default new Settings();

