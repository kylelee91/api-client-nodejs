import * as JsonApi from "../../jsonapi/index";
import * as ApiRequest from "../../common/request";
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

export type Actions = "start" | "stop" | "apply_datacenters";

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

    public static async get(query?: ApiRequest.QueryParams): Promise<Collection> {
        return ApiRequest._get<Collection>(this.target, query);
    }

    public static async create(doc: NewParams, query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._post<Single>(
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

    public async get(query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._patch<Single>(
            this.target,
            new FormattedDoc({ id: this.id, type: "environments", attributes: doc }),
            query
        );
    }

    public async delete(query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._delete<Single>(this.target, query);
    }

    public async start() {
        return this.tasks().create("start");
    }

    public async stop() {
        return this.tasks().create("stop");
    }

    public async changeDataCenters(dcs: string[]) {
        return this.tasks().create("apply_datacenters", { dcs: dcs });
    }

    public tasks() {
        return {
            create: async (
                action: Actions,
                contents?: Object,
                query?: ApiRequest.QueryParams
            ): Promise<Task<Actions>> => {
                return ApiRequest._post<Task<Actions>>(
                    `${this.target}/tasks`,
                    new Task(action, contents),
                    query
                );
            }
        };
    }
}
