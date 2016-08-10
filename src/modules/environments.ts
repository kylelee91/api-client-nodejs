import * as JsonApi from "../jsonapi/index";
import * as ApiRequest from "../common/request";
import { Id, State, Events, Task, Time, FormattedDoc } from "../common/structures";

export function document(): typeof EnvironmentsRequest;
export function document(id: string): EnvironmentRequest;
export function document(id?: string): typeof EnvironmentsRequest | EnvironmentRequest {
    if (!id) {
        return EnvironmentsRequest;
    }

    return new EnvironmentRequest(id);
}

export interface EnvironmentCollection extends JsonApi.CollectionDocument {
    data: EnvironmentResource[];
}

export interface Environment extends JsonApi.ResourceDocument {
    data: EnvironmentResource | null;
}

export type EnvironmentState = "live" | "cloning" | "deleting" | "deleted";
export interface EnvironmentResource extends JsonApi.Resource {
    id: Id;
    type: "environments";
    attributes: {
        name: string;
        about: {
            description: string;
            developer: {
                name: string;
                website: string;
                organization: string;
            };
            version: string;
            release_date: Time;
            documentation_url: string;
        };
        state: State<EnvironmentState>;
        events: Events;
    };

    relationships?: {
        account: JsonApi.ToOneRelationship;
        datacenters: JsonApi.ToManyRelationship;
        team: JsonApi.ToOneRelationship;
    };

    meta?: {
        counts: {
            instances: number;
            containers: number;
        }
    };
}

export interface NewEnvironmentParams {
    name: string;
    about: {
        description: string;
    };
}

export interface UpdateEnvironmentParams {
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

export class EnvironmentsRequest {
    private static target = "environments";

    public static async get(query?: ApiRequest.QueryParams): Promise<EnvironmentCollection> {
        return ApiRequest._get<EnvironmentCollection>(this.target, query);
    }

    public static async create(doc: NewEnvironmentParams, query?: ApiRequest.QueryParams): Promise<Environment> {
        return ApiRequest._post<Environment>(this.target, new FormattedDoc({ type: "environments", attributes: doc }), query);
    }
}

export type EnvironmentActions = "start" | "stop" | "apply_datacenters";
export class EnvironmentRequest {
    private target: string;

    constructor(private id: string) {
        this.target = `environments/${id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Environment> {
        return ApiRequest._get<Environment>(this.target, query);
    }

    public async update(doc: UpdateEnvironmentParams, query?: ApiRequest.QueryParams): Promise<Environment> {
        return ApiRequest._patch<Environment>(
            this.target,
            new FormattedDoc({ id: this.id, type: "environments", attributes: doc }),
            query
        );
    }

    public async delete(query?: ApiRequest.QueryParams): Promise<Environment> {
        return ApiRequest._delete<Environment>(this.target, query);
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
                action: EnvironmentActions,
                contents?: Object,
                query?: ApiRequest.QueryParams
            ): Promise<Task<EnvironmentActions>> => {
                return ApiRequest._post<Task<EnvironmentActions>>(
                    `${this.target}/tasks`,
                    new Task(action, contents),
                    query
                );
            }
        };
    }
}
