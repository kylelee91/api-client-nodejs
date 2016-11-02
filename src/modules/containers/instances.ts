import * as API from "common/api";
import {
    CollectionDoc,
    SingleDoc,
    Resource,
    ResourceId,
    State,
    Time,
    Events,
    QueryParams
} from "common/structures";

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
    readonly data: Resource[];
}

export interface Single extends SingleDoc {
    readonly data: Resource | null;
}

export interface Log extends SingleDoc {
    readonly data: {
        readonly id: ResourceId;
        readonly events: Events;
        readonly output: string;
        readonly type: string;
        readonly instance: ResourceId;
    };
}

export type States = "starting" | "running" | "stopping" | "stopped" | "deleting" | "deleted" | "error";
export interface Instance extends Resource {
    readonly id: ResourceId;
    readonly hostname: string;
    readonly volumes: Volume[];
    readonly state: State<States>;
    readonly location: Location;
    readonly environment: ResourceId;
    readonly container: ResourceId;
    readonly events: Events & {
        readonly first_boot: Time;
        readonly started: Time;
    };

    readonly networks?: {
        readonly id: ResourceId;
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
}

export interface Volume {
    readonly container_volume: ResourceId;
    readonly path: string;
    readonly password: string;
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

