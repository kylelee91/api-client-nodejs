// tslint:disable-next-line
import { CycleErrorDetail, ResultFail, ResultSuccess } from "../../common/api";
import * as JsonApi from "../../jsonapi/index";
import * as API from "../../common/api";
import { Id, State, Events, Task, Time, FormattedDoc, Scope } from "../../common/structures";

export function document(): typeof CollectionRequest;
export function document(id: string): SingleRequest;
export function document(id?: string): typeof CollectionRequest | SingleRequest {
    if (!id) {
        return CollectionRequest;
    }

    return new SingleRequest(id);
}

export interface Collection extends JsonApi.CollectionDocument {
    data: Resource[];
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Resource extends JsonApi.Resource {
    id: Id;
    type: "environments";
    attributes: {
        name: string;
        about: {
            description: string;
        };
        owner: Scope;
        state: State<States>;
        events: Events;
    };

    relationships?: {
        creator: JsonApi.ToOneRelationship;
    };

    meta?: {
        counts: {
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

    public static async get(query?: API.QueryParams) {
        return API.get<Collection>(this.target, query);
    }

    public static async create(doc: NewParams, query?: API.QueryParams) {
        return API.post<Single>(
            this.target,
            new FormattedDoc({ type: "environments", attributes: doc }),
            query
        );
    }
}

export class SingleRequest {
    private target: string;

    constructor(private id: string) {
        this.target = `environments/${id}`;
    }

    public async get(query?: API.QueryParams) {
        return API.get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: API.QueryParams) {
        return API.patch<Single>(
            this.target,
            new FormattedDoc({ id: this.id, type: "environments", attributes: doc }),
            query
        );
    }

    public async delete(query?: API.QueryParams) {
        return API.del<Single>(this.target, query);
    }

    public async start() {
        return this.task("start");
    }

    public async stop()  {
        return this.task("stop");
    }

    public task(action: Actions, contents?: Object, query?: API.QueryParams) {
        return API.post<Task<Actions>>(
            `${this.target}/tasks`,
            new Task(action, contents),
            query
        );
    }
}
