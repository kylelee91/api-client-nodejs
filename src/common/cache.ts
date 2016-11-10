interface Entry {
    value: any;
    options: any;
    team?: string;
    timer: number | null;
}

export class Cache {

    private registry: {[key: string]: Entry} = {};

    public get<T>(key: string, options?: {}, team?: string): T | undefined {
        if (!this.registry[key]) {
            // Cache miss
            return undefined;
        }
        
        if (options) {
            // Different options. Cache miss.
            if (JSON.stringify(this.registry[key].options) !== JSON.stringify(options)) {
                return undefined;
            }
        }

        // Different team. Cache miss.
        if (this.registry[key].team !== team) {
            return undefined;
        } 

        return this.registry[key].value;
    }

    public set(key: string, value: any, options: any, team?: string, timeout?: number) {
        if (!timeout) {
            timeout = 1000;
        }
        this.clear(key);
        this.registry[key] = {value: value, options: options, timer: null, team: team};
        this.registry[key].timer = setTimeout(() => this.clear(key), timeout);
        return value;
    }

    public clear(key: string) {
        if (!this.registry[key]) {
            return;
        }
        this.registry[key].value = null;
        clearTimeout(<number>this.registry[key].timer);
    }
}

export default new Cache();
