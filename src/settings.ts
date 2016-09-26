import { StorageInterface, CacheStorage } from "./auth/storage";
import { Client } from "./auth/client";
import { Id } from "./common/structures";

export type Version = 1;

export interface SettingsProps {
    readonly version?: Version;
    readonly team?: Id | undefined;
    readonly cache?: {
        readonly use: boolean;
        readonly refresh?: number;
    };
    readonly auth?: {
        readonly tokenUrl: string;
        readonly refreshUrl: string;
    };
    readonly storage?: StorageInterface;
    readonly url?: string;
    readonly client?: Client;
    readonly autoRefreshToken?: boolean;
}

export class Settings implements SettingsProps {
    readonly version: Version = 1;
    readonly team: Id | undefined = undefined;
    readonly cache = {
        use: true,
        refresh: 1000,
    };
    readonly auth = {
        tokenUrl: "https://api.cycle.io:14000/auth/token",
        refreshUrl: "https://api.cycle.io:14000/auth/refresh",
    };
    readonly client: Client | undefined;
    readonly storage: StorageInterface = new CacheStorage();
    readonly url = "https://api.cycle.io";
    readonly autoRefreshToken = true;

    public update(s: SettingsProps) {
        Object.assign(this, s);
    }
};

export default new Settings();
