import * as API from "../../common/api";
import {
    CollectionDoc,
    SingleDoc,
    ResourceId,
    Resource,
    QueryParams,
    State,
    Task,
    Events,
    Scope,
    Time
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
    data: Notification[];
    meta?: CollectionMeta;
}

export interface Single extends SingleDoc {
    data: Notification | null;
}

export interface Notification extends Resource {
    id: ResourceId;
    creator: ResourceId;
    code: string;
    url: string;
    message: string;
    owner: Scope;
    events: Events & { read: Time };
    state: State<States>;
    type: Types;
}

export interface CollectionMeta {
    unread: number;
}

export type States = "new" | "read" | "hidden";
export type Types = "success" | "error" | "warning" | "info";

export type CollectionActions = "mark_read";
export class CollectionRequest {
    public static readonly target = "notifications";

    public static async get(query?: QueryParams) {
        return API.get<Collection>(this.target, query);
    }

    public static async markAllAsRead() {
        return this.task(new Task("mark_read"));
    }

    public static async task(t: Task<CollectionActions>, query?: QueryParams) {
        return API.post<Task<CollectionActions>>(
            `${this.target}/tasks`,
            t,
            query
        );
    }
}

export class SingleRequest {
    private target: string;

    constructor(id: ResourceId) {
        this.target = `notifications/${id}`;
    }

    public async markAsRead() {
        return this.task(new Task("mark_read"));
    }

    public async task(t: Task<CollectionActions>, query?: QueryParams) {
        return API.post<Task<CollectionActions>>(
            `${this.target}/tasks`,
            t,
            query
        );
    }

    public async get(query?: QueryParams) {
        return API.get<Single>(this.target);
    }
}
