import * as API from "../../common/api";
import {
    CollectionDoc,
    SingleDoc,
    Resource,
    ResourceId,
    QueryParams,
    State,
    Events,
    Task,
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
    data: Environment[];
}

export interface Single extends SingleDoc {
    data: Environment | null;
}

export interface Environment extends Resource {
    id: ResourceId;
    type: "environments";
    name: string;
    about: {
        description: string;
    };
    owner: Scope;
    state: State<States>;
    events: Events;
    creator: ResourceId;

    meta?: {
        counts?: {
            instances: number;
            containers: number;
        }
    };
}

export type States = "live" | "cloning" | "deleting" | "deleted";

export type Actions = "start" | "stop";

export interface NewParams {
    name: string;
    about: {
        description: string;
    };
}

export interface UpdateParams {
    name?: string;
    about?: {
        description?: string;
        developer?: {
            name?: string;
            website?: string;
            organization?: string;
        };
        version?: string;
        release_date?: Time;
        documentation_url?: string;
    };
}

export class CollectionRequest {
    private static target = "environments";

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
        this.target = `environments/${id}`;
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

    public async start() {
        return this.task("start");
    }

    public async stop()  {
        return this.task("stop");
    }

    public task(action: Actions, contents?: Object, query?: QueryParams) {
        return API.post<Task<Actions>>(
            `${this.target}/tasks`,
            new Task(action, contents),
            query
        );
    }
}
