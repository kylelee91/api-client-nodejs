import Token from "./token";

export interface StorageInterface {
    read(): Token | undefined;
    write(t: Token): void;
    delete(): void;
}

class CacheStorage implements StorageInterface {
    private token: Token | undefined;    
    
    public read(): Token | undefined {
        return this.token;
    }
    
    public write(t: Token):  void {
        this.token = t;
    }
    
    public delete(): void {
        this.token = undefined;
    }
}

let inst: StorageInterface = new CacheStorage();

export function getStorage() {
    return inst;
}

export function setStorage(storage: StorageInterface) {
    inst = storage;
}

