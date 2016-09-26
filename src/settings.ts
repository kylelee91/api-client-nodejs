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

const defaults = {
    version: 1 as Version,
    team: undefined,
    cache: {
        use: true,
        refresh: 1000,
    },
    auth: {
        tokenUrl: "",
        refreshUrl: "",
    },
    storage: new CacheStorage(),
    url: "//api.cycle.io",
    autoRefreshToken: true
};

let settings: SettingsProps = defaults;
export default settings;

export function setSettings(s: SettingsProps) {
    settings = Object.assign(s, defaults);
}
