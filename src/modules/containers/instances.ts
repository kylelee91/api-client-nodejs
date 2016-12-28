import * as API from "../../common/api";
import {
    CollectionDoc,
    SingleDoc,
    Resource,
    ResourceId,
    State,
    Time,
    Events,
    QueryParams
} from "../../common/structures";

export function document(container: ResourceId): CollectionRequest;
export function document(container: ResourceId, id: ResourceId): SingleRequest;
export function document(container?: ResourceId, id?: ResourceId): CollectionRequest | SingleRequest {
    if (!container) {
        throw new Error("Getting list of instances not yet supported.");
    }

    if (id) {
        return new SingleRequest(container, id);
    }

    return new CollectionRequest(container);
}

export interface Collection extends CollectionDoc {
    data: Instance[];
}

export interface Single extends SingleDoc {
    data: Instance | null;
}

export interface Log extends SingleDoc {
    data: {
        id: ResourceId;
        events: Events;
        output: string;
        type: string;
        instance: ResourceId;
    };
}

export type States = "starting" | "running" | "stopping" | "stopped" | "deleting" | "deleted" | "error";
export interface Instance extends Resource {
    hostname: string;
    state: State<States>;
    location: Location;
    environment: ResourceId;
    container: ResourceId;
    events: Events & {
        first_boot: Time;
        started: Time;
    };
    meta?: {
        networks?: Network[];
        volumes?: Volume[];
    };
}

export interface Network {
    id: ResourceId;
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
}

export interface Location {
    continent: string;
    country: string;
    city: string;
    state: string;
}

export interface Network {
    id: ResourceId;
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
}

export interface Volume {
    container_volume: ResourceId;
    path: string;
    password: string;
    ip: string;
    port: number;
    username: string;
    remote_access: boolean;
}

// List of container instance documents
export type LogTypes = "startup_process_first" | "startup_process" | "shutdown_process";

// List of container instance documents
export class CollectionRequest {
    private target: string;

    constructor(container_id: ResourceId) {
        this.target = `containers/${container_id}/instances`;
    }

    public async get(query?: QueryParams) {
        return API.get<Collection>(this.target, query);
    }
}


export class SingleRequest {
    private target: string;

    constructor(private container_id: ResourceId, private instance_id: ResourceId) {
        this.target = `containers/${container_id}/instances/${instance_id}`;
    }

    public async get(query?: QueryParams) {
        return API.get<Single>(this.target, query);
    }

    public log(type: LogTypes) {
        return {
            get: async (query?: QueryParams) => {
                return API.get<Log>(`${this.target}/logs/${type}`, query);
            }
        };
    }
}

