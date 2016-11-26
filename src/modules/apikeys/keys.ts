import * as API from "../../common/api";
import {
    CollectionDoc,
    SingleDoc,
    Resource,
    ResourceId,
    QueryParams,
    Events,
    State
} from "../../common/structures";

export function document(): typeof CollectionRequest;
export function document(id: ResourceId): SingleRequest;
export function document(id?: ResourceId): typeof CollectionRequest | SingleRequest {
    if (!id) {
        return CollectionRequest;
    }

    return new SingleRequest(id);
}

export interface Collection extends CollectionDoc {
    data: ApiKey[];
}

export interface Single extends SingleDoc {
    data: ApiKey | null;
}

export interface ApiKey extends Resource {
    name: string;
    secret: string;
    creator: string;
    whitelist: Whitelist;
    readonly: boolean;
    events: Events;
    state: State<"">;
}

export interface Whitelist {
    enable: boolean;
    ips: string[];
}

export interface NewParams {
    name: string;
    readonly: boolean;
    whitelist?: Whitelist;
}

export interface UpdateParams {
    name?: string;
    readonly?: boolean;
    whitelist?: Whitelist;
}

export class CollectionRequest {
    private static target = "api/keys";

    public static async get(query?: QueryParams) {
        return API.get<Collection>(this.target, query);
    }

    public static async create(doc: NewParams, query?: QueryParams) {
        return API.post<Single>(this.target, doc, query);
    }
}

export class SingleRequest {
    private target: string;

    constructor(private id: ResourceId) {
        this.target = `api/keys/${id}`;
    }

    public async get(query?: QueryParams) {
        return API.get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: QueryParams) {
        return API.patch<Single>(this.target, doc, query);
    }

    public async delete(query?: QueryParams) {
        return API.del<Single>(this.target, query);
    }
}
