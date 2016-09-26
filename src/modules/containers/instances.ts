// tslint:disable-next-line
import { ErrorDetail, ResultFail, ResultSuccess } from "../../common/api";
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
    data: Resource[];
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Log extends JsonApi.ResourceDocument {
    data: {
        id: Id;
        type: string;
        attributes: {
            events: Events;
            output: string;
            type: string;
        };
        relationships: {
            instance: JsonApi.ToOneRelationship;
        };
    };
}

export type States = "starting" | "running" | "stopping" | "stopped" | "deleting" | "deleted" | "error";
export interface Resource extends JsonApi.Resource {
    id: Id;
    type: "instances";
    attributes: {
        hostname: string;
        volumes: Volume[];
        state: State<States>;
        location: Location;
        events: Events & {
            first_boot: Time;
            started: Time;
        };
    };

    relationships?: {
        environment: JsonApi.ToOneRelationship;
        container: JsonApi.ToOneRelationship;
    };

    meta: {
        location?: {
            continent: string;
            country: string;
            city: string;
            state: string;
        };

        networks?: {
            id: string;
            gateway: string;
            broadcast: string;
            name: string;
            cidr: string;
            type: string;
            assignment: {
                ip: {
                    address: string;
                    mask: number;
                };
            };
            instance: string;
            released: string;
            claimed: string;
        }[];
    };
}

export interface Volume {
    container_volume: Id;
    path: string;
    password: string;
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

