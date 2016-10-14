// tslint:disable-next-line
import { CycleErrorDetail, ResultFail, ResultSuccess } from "../../common/api";
import * as JsonApi from "../../jsonapi/index";
import * as API from "../../common/api";
import { Id, State, Events, Time } from "../../common/structures";

export function document(container: Id): CollectionRequest;
export function document(container: Id, id: Id): SingleRequest;
export function document(container?: Id, id?: Id): CollectionRequest | SingleRequest {
    if (!container) {
        throw new Error("Getting list of instances not yet supported.");
    }

    if (id) {
        return new SingleRequest(container, id);
    }

    return new CollectionRequest(container);
}

export interface Collection extends JsonApi.CollectionDocument {
    readonly data: Resource[];
}

export interface Single extends JsonApi.ResourceDocument {
    readonly data: Resource | null;
}

export interface Log extends JsonApi.ResourceDocument {
    readonly data: {
        readonly id: Id;
        readonly type: string;
        readonly attributes: {
            readonly events: Events;
            readonly output: string;
            readonly type: string;
        };
        readonly relationships: {
            readonly instance: JsonApi.ToOneRelationship;
        };
    };
}

export type States = "starting" | "running" | "stopping" | "stopped" | "deleting" | "deleted" | "error";
export interface Resource extends JsonApi.Resource {
    readonly id: Id;
    readonly type: "instances";
    readonly attributes: {
        readonly hostname: string;
        readonly volumes: Volume[];
        readonly state: State<States>;
        readonly location: Location;
        readonly events: Events & {
            readonly first_boot: Time;
            readonly started: Time;
        };
    };

    readonly relationships?: {
        readonly environment: JsonApi.ToOneRelationship;
        readonly container: JsonApi.ToOneRelationship;
    };

    readonly meta: {
        readonly location?: {
            readonly continent: string;
            readonly country: string;
            readonly city: string;
            readonly state: string;
        };

        readonly networks?: {
            readonly id: string;
            readonly gateway: string;
            readonly broadcast: string;
            readonly name: string;
            readonly cidr: string;
            readonly type: string;
            readonly assignment: {
                readonly ip: {
                    readonly address: string;
                    readonly mask: number;
                };
            };
            readonly instance: string;
            readonly released: string;
            readonly claimed: string;
        }[];
    };
}

export interface Volume {
    readonly container_volume: Id;
    readonly path: string;
    readonly password: string;
}

// List of container instance documents
export type LogTypes = "startup_process_first" | "startup_process" | "shutdown_process";

// List of container instance documents
export class CollectionRequest {
    private target: string;

    constructor(container_id: string) {
        this.target = `containers/${container_id}/instances`;
    }

    public async get(query?: API.QueryParams) {
        return API.get<Collection>(this.target, query);
    }
}


export class SingleRequest {
    private target: string;

    constructor(private container_id: string, private instance_id: string) {
        this.target = `containers/${container_id}/instances/${instance_id}`;
    }

    public async get(query?: API.QueryParams) {
        return API.get<Single>(this.target, query);
    }

    public log(type: LogTypes) {
        return {
            get: async (query?: API.QueryParams) => {
                return API.get<Log>(`${this.target}/logs/${type}`, query);
            }
        };
    }
}

