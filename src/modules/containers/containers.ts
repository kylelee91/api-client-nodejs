import * as JsonApi from "../../jsonapi";
import * as ApiRequest from "../../common/request";
import * as Instances from "./instances";
import * as Images from "../images";
import { Id, State, Events, FormattedDoc, Task } from "../../common/structures";

/**
 * Entrypoint for interacting with containers API
 */
export function document(): typeof CollectionRequest;
export function document(id: string): SingleRequest;
export function document(id?: string): typeof CollectionRequest | SingleRequest {
    if (id) {
        return new SingleRequest(id);
    }

    return CollectionRequest;
}

/**
 * A JSON API Document containing a collection of containers 
 */
export interface Collection extends JsonApi.CollectionDocument {
    data: Resource[];
}

/**
 * A JSON API Document containing a container resource
 */
export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

/**
 * An individual container resource
 */
export interface Resource extends JsonApi.Resource {
    id: Id;
    type: "containers";
    attributes: {
        name: string;
        config: Config;
        spawns: number;
        scaling: Scaling;
        volumes: Volume[];
        state: State<States>;
        events: Events;
    };
    relationships?: {
        environment: JsonApi.ToOneRelationship;
        image: JsonApi.ToOneRelationship;
        plan: JsonApi.ToOneRelationship;
        domain: JsonApi.ToOneRelationship;
    };
    meta?: {
        counts?: {
            instances: {
                starting: number;
                running: number;
                stopping: number;
                stopped: number;
                deleting: number;
                deleted: number;
                errored: number;
            }
        };
        location?: {
            continent: string;
            country: string;
            city: string;
            state: string;
        };
        image?: Images.Resource;
        ip?: {
            address: string;
            mask: string;
        }
    };
}

/**
 * Potential states container can be in at any given time
 */
export type States = "starting" | "running" | "stopping" | "stopped" | "deleting" | "deleted";

/**
 * Possible actions that can be taken on a container.
 * start: Start container
 * stop: Stop container
 * apply: Change any properties of a container that will need to propagate to multiple instances
 */
export type SingleActions = "start" | "stop" | "apply" | "reimage";

export interface ModifyTaskParams {
    plan?: Id;
    domain?: Id;
    hostname?: string;
    runtime?: RuntimeConfig;
    tls?: TLS;
    flags?: Flags;
}

export interface ReimageParams {
    image: Id;
}

export interface Config {
    flags: Flags;
    tls: TLS;
    dnsrecord: Id;
    runtime: RuntimeConfig;
}

export interface Flags {
    auto_restart: boolean;
}

export interface RuntimeConfig {
    env_vars?: { [key: string]: string };
    command?: {
        args: string[];
        override: boolean;
    };
};

export type ScalingMethods = "persistent" | "geodns" | "loadbalance" | "loadbalance-geodns";
export interface Scaling {
    method: ScalingMethods;
    hostname: string;
    geodns?: GeoDNS;
    loadbalance?: LoadBalance;
    persistent?: Persistent;
}

export interface GeoDNS {
    datacenters: Id[];
    max_per_dc: number;
    min_per_dc: number;
}

export interface LoadBalance {
    datacenter: Id;
    max: number;
    min: number;
    public_interface?: boolean;
}

export interface Persistent {
    datacenter: string;
    public_interface?: boolean;
}

export interface Volume {
    id?: Id;
    volume_plan: string;
    path: string;
    remote_access: boolean;
}

export interface TLS {
    enabled: boolean;
    path: string;
}

export interface NewParams {
    name: string;
    environment: Id;
    config: {
        flags?: Flags;
        tls?: TLS;
        dnsrecord?: Id;
        runtime?: RuntimeConfig;
    };
    plan: Id;
    image: Id;
    scaling: Scaling;
    domain?: Id;
    tls?: TLS;
    volumes: Volume[];
}

export interface UpdateParams {
    name?: string;
    volumes?: { id: string, remote_access: boolean }[];
}

export interface EventCollection extends JsonApi.CollectionDocument {
    data: {
        id: Id;
        type: string;
        attributes: {
            caption: string;
            time: string;
            platform: boolean,
            type: string;
        }
    }[];
}

export interface CompatibleImages extends Images.Collection {}

export class CollectionRequest {
    private static target = "containers";

    public static async get(query?: ApiRequest.QueryParams): Promise<Collection> {
        return ApiRequest._get<Collection>(this.target, query);
    }

    public static async create(doc: NewParams, query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._post<Single>(this.target, generateNewContainerDoc(doc), query);
    }
}

export class SingleRequest {
    private target: string;

    constructor(private id: string) {
        this.target = `containers/${id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._patch<Single>(
            this.target,
            new FormattedDoc({ id: this.id, type: "containers", attributes: doc }),
            query
        );
    }

    public async delete(query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._delete<Single>(this.target, query);
    }

    public async start() {
        return this.task(new Task<"start">("start"));
    }

    public async stop() {
        return this.task(new Task<"stop">("stop"));
    }

    public async apply(mods: ModifyTaskParams) {
        return this.task(new Task<"apply">("apply", mods));
    }

    public async reimage(params: ReimageParams) {
        return this.task(new Task<"reimage">("reimage", params));
    }

    public async compatibleImages(query?: ApiRequest.QueryParams): Promise<CompatibleImages> {
        return ApiRequest._get<CompatibleImages>(`${this.target}/compatible-images`, query);
    }

    public task(t: Task<SingleActions>, query?: ApiRequest.QueryParams): Promise<Task<SingleActions>> {
        return ApiRequest._post<Task<SingleActions>>(
            `${this.target}/tasks`,
            t,
            query
        );
    }

    public events() {
        return {
            get: async (query?: ApiRequest.QueryParams): Promise<EventCollection> => {
                return ApiRequest._get<EventCollection>(`${this.target}/events`, query);
            }
        };
    }

    public instances(): Instances.CollectionRequest;
    public instances(id: Id): Instances.SingleRequest;
    public instances(id?: Id): Instances.CollectionRequest | Instances.SingleRequest {
        if (id) {
            return new Instances.SingleRequest(this.id, id);
        }

        return new Instances.CollectionRequest(this.id);
    }
}

/**
 * Internal function for generating new container doc based on new params
 */
function generateNewContainerDoc(attr: NewParams) {
    let attributes = {
        name: attr.name,
        scaling: attr.scaling,
        volumes: attr.volumes,
        tls: attr.tls,
        config: attr.config
    };
    let relationships = {
        image: {
            data: {
                type: "images",
                id: attr.image
            }
        },
        plan: {
            data: {
                type: "plans",
                id: attr.plan
            }
        },
        environment: {
            data: {
                type: "environments",
                id: attr.environment
            }
        },
        domain: {
            data: {
                type: "domains",
                id: attr.domain
            }
        }
    };

    return new FormattedDoc({ type: "containers", attributes: attributes, relationships: relationships });
}
