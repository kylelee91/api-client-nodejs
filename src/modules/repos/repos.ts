import * as API from "common/api";
import {
    CollectionDoc,
    SingleDoc,
    ResourceId,
    Resource,
    QueryParams,
    Scope,
    State,
    Task,
    Events
} from "common/structures";


export function document(): typeof CollectionRequest;
export function document(id: ResourceId): SingleRequest;
export function document(id?: ResourceId): typeof CollectionRequest | SingleRequest {
    if (!id) {
        return CollectionRequest;
    }

    return new SingleRequest(id);
}

export interface Collection extends CollectionDoc {
    readonly data: Repo[];
}

export interface Single extends SingleDoc {
    readonly data: Repo;
}

export interface Repo extends Resource {
    readonly id: ResourceId;
    readonly creator: ResourceId;
    readonly name: string;
    readonly about: {
        readonly description: string;
    };
    readonly type: Types;
    readonly owner: Scope;
    readonly url: string;
    readonly auth: {
        readonly private_key: string;
    };
    readonly state: State<States>;
    readonly events: Events;
}

export type States = "live" | "building" | "deleting" | "deleted" | "error";

export type Types = "git";

export interface NewParams {
    name: string;
    url: string;
    type: Types;
    auth?: {
        private_key: string;
    };
}

export interface UpdateParams {
    name?: string;
    auth?: {
        private_key: string;
    };
}

export interface BuildParams {
    latest: boolean;
    commit: string;
    description: string;
}

export class CollectionRequest {
    private static target = "repos";

    public static async get(query?: QueryParams) {
        return API.get<Collection>(this.target, query);
    }

    public static async create(doc: NewParams, query?: QueryParams) {
        return API.post<Single>(
            this.target,
            doc,
            query
        );
    }
}

export type SingleActions = "build";
export class SingleRequest {
    private target: string;

    constructor(private id: ResourceId) {
        this.target = `repos/${id}`;
    }

    public async get(query?: QueryParams) {
        return API.get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: QueryParams) {
        return API.patch<Single>(this.target, doc, query);
    }

    public async delete(query?: QueryParams) {
        return API.del<Task<SingleActions>>(this.target, query);
    }

    public async build(options: BuildParams) {
        return this.task("build", options);
    }

    public async task(action: SingleActions, contents?: Object) {
        return API.post<Task<SingleActions>>(`${this.target}/tasks`, new Task(action, contents));
    }
}

