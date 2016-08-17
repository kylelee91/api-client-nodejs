import * as JsonApi from "../../jsonapi/index";
import * as ApiRequest from "../../common/request";
import { Id, State, Events, Time } from "../../common/structures";

export function document(): typeof CollectionRequest;
export function document(container: Id, id: Id): SingleRequest;
export function document(container?: Id, id?: Id): typeof CollectionRequest | SingleRequest {
    if (container && id) {
        return new SingleRequest(container, id);
    }

    return CollectionRequest;
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
export type LogTypes = "startup_process_first" | "startup_process";

// List of container instance documents
export class CollectionRequest {
    private target: string;

    constructor(container_id: string) {
        this.target = `containers/${container_id}/instances`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Collection> {
        return ApiRequest._get<Collection>(this.target, query);
    }
}


export class SingleRequest {
    private target: string;

    constructor(private container_id: string, private instance_id: string) {
        this.target = `containers/${container_id}/instances/${instance_id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._get<Single>(this.target, query);
    }

    public log(type: LogTypes) {
        return {
            get: async (query?: ApiRequest.QueryParams): Promise<Log> => {
                return ApiRequest._get<Log>(`${this.target}/logs/${type}`, query);
            }
        };
    }
}

