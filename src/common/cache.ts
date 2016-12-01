interface Entry {
    value: any;
    options: any;
    team?: string;
    timer: number | null;
}

export class Cache {

    private registry: {[key: string]: Entry | undefined} = {};

    public get<T>(key: string, options?: {}, team?: string): T | undefined {
        const cache = this.registry[key];
        if (!cache) {
            // Cache miss
            return undefined;
        }
        
        if (options) {
            // Different options. Cache miss.
            if (JSON.stringify(cache.options) !== JSON.stringify(options)) {
                return undefined;
            }
        }

        // Different team. Cache miss.
        if (cache.team !== team) {
            return undefined;
        } 

        return cache.value;
    }

    public set(key: string, value: any, options: any, team?: string, timeout?: number) {
        if (!timeout) {
            timeout = 1000;
        }
        this.clear(key);
        const cache = <Entry>{value: value, options: options, timer: null, team: team};
        cache.timer = setTimeout(() => this.clear(key), timeout);
        this.registry[key] = cache;
        return value;
    }

    public clear(key: string) {
        const cache = this.registry[key];
        if (!cache) {
            return;
        }
        this.registry[key] = undefined;
        clearTimeout(<number>cache.timer);
    }
}

export default new Cache();
