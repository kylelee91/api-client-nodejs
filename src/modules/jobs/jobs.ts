import * as API from "../../common/api";
import * as Tasks from "./tasks";
import {
    CollectionDoc,
    SingleDoc,
    ResourceId,
    QueryParams,
    State,
    Events,
    Scope,
    Time
} from "../../common/structures";


export function document(): typeof CollectionRequest;
export function document(id: ResourceId): SingleRequest;
export function document(id?: ResourceId): CollectionRequest | SingleRequest {
    if (!id) {
        return CollectionRequest;
    }

    return new SingleRequest(id);
}

export interface Collection extends CollectionDoc {
    data: Job[];
}

export interface Single extends SingleDoc {
    data: Job;
}

export interface Job {
    id: ResourceId;
    creator: ResourceId;
    expires: Time;
    queue: string;
    caption: string;
    schedule: Time;
    state: State<States>;
    tasks: Tasks.Task[];
    owner: Scope;
    events: Events & {
        created: Time;
        queued: Time;
        started: Time;
        completed: Time;
    };
}

export type States = "new" | "running" | "expired" | "completed" | "queued" | "error" | "scheduled";

export class CollectionRequest {
    public static async get(query?: QueryParams) {
        return API.get<Collection>("jobs", query);
    }
}

export class SingleRequest {
    private target: string;

    constructor(id: ResourceId) {
        this.target = `jobs/${id}`;
    }

    public async get(query?: QueryParams) {
        return API.get<Single>(this.target, query);
    }
}

