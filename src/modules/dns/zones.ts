import * as API from "../../common/api";
import * as Records from "./records";
import * as Containers from "../containers";
import {
    CollectionDoc,
    SingleDoc,
    Resource,
    ResourceId,
    QueryParams,
    State,
    Events,
    NewTask,
    Task,
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
    data: Zone[];
}

export interface Single extends SingleDoc {
    data: Zone | null;
    includes?: {
        containers: {
            [key: string]: Containers.Container;
        }
    };
}

export interface Zone extends Resource {
    origin: string;
    records: Records.Record[];
    state: State<States>;
    events: Events & {
        last_verification: Time;
        verified: Time;
    };
}

export type States = "pending" | "live" | "syncing" | "deleting" | "deleted";

export type SingleActions = "verify";

export interface NewParams {
    origin: string;
}

export interface UpdateParams {
    origin: string;
    records?: Records.UpdateParams[];
}

export class CollectionRequest {
    private static target = "dns/zones";

    public static async get(query?: QueryParams) {
        return API.get<Collection>(this.target, query);
    }

    public static async create(doc: NewParams, query?: QueryParams) {
        return API.post<Single>(this.target, doc, query);
    }
}

export class SingleRequest {
    private target: string = "dns/zones";

    constructor(private id: ResourceId) {
        this.target = `${this.target}/${id}`;
    }

    public async get(query?: QueryParams) {
        return API.get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: QueryParams) {
        return API.patch<Single>(this.target, doc, query);
    }

    public async verify() {
        return this.task("verify");
    }

    public async task(action: SingleActions, contents?: Object, query?: QueryParams) {
        return API.post<Task<SingleActions>>(
            `${this.target}/tasks`,
            new NewTask<SingleActions>(action, contents),
            query
        );
    }

    public async delete() {
        return API.del<Task<"delete">>(this.target);
    }

    public records(): Records.CollectionRequest;
    public records(id: ResourceId): Records.SingleRequest;
    public records(id?: ResourceId): Records.CollectionRequest | Records.SingleRequest {
        if (id) {
            return new Records.SingleRequest(this.id, id);
        }

        return new Records.CollectionRequest(this.id);
    }
}
