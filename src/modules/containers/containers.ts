import * as API from "common/api";
import * as Instances from "./instances";
import * as Images from "../images";
import * as Plans from "../plans";
import {
    CollectionDoc,
    SingleDoc,
    Resource,
    ResourceId,
    State,
    Task,
    Events,
    QueryParams
} from "common/structures";

/**
 * Entrypoint for interacting with containers API
 */
export function document(): typeof CollectionRequest;
export function document(id: ResourceId): SingleRequest;
export function document(id?: ResourceId): typeof CollectionRequest | SingleRequest {
    if (id) {
        return new SingleRequest(id);
    }

    return CollectionRequest;
}

/**
 * A JSON API Document containing a collection of containers 
 */
export interface Collection extends CollectionDoc {
    readonly data: Container[];
    includes?: {
        images: { [key: string]: Images.Image };
        plans: { [key: string]: Images.Image };
    };
}

/**
 * A JSON API Document containing a container resource
 */
export interface Single extends SingleDoc {
    readonly data: Container | null;
    includes?: {
        images: { [key: string]: Images.Image }
        plans: { [key: string]: Images.Image };
    };
}

/**
 * An individual container resource
 */
export interface Container extends Resource {
    readonly id: ResourceId;
    readonly name: string;
    readonly config: Config;
    readonly spawns: number;
    readonly scaling: Scaling;
    readonly volumes: Volume[];
    readonly state: State<States>;
    readonly events: Events;
    readonly environment: ResourceId;
    readonly image: ResourceId;
    readonly plan: ResourceId;
    readonly domain: ResourceId;
    readonly meta?: {
        readonly counts?: {
            readonly instances: {
                readonly starting: number;
                readonly running: number;
                readonly stopping: number;
                readonly stopped: number;
                readonly deleting: number;
                readonly deleted: number;
                readonly errored: number;
            }
        };
        readonly location?: {
            readonly continent: string;
            readonly country: string;
            readonly city: string;
            readonly state: string;
        };
        readonly ip?: {
            readonly address: string;
            readonly mask: string;
        },
        readonly plan?: Plans.Plan;
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
    plan?: ResourceId;
    domain?: ResourceId;
    hostname?: string;
    runtime?: RuntimeConfig;
    tls?: TLS;
    flags?: Flags;
}

export interface ReimageParams {
    image: ResourceId;
}

export interface Config {
    flags: Flags;
    tls: TLS;
    dnsrecord: ResourceId;
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
    readonly method: ScalingMethods;
    readonly hostname: string;
    readonly geodns?: GeoDNS;
    readonly loadbalance?: LoadBalance;
    readonly persistent?: Persistent;
}

export interface GeoDNS {
    readonly datacenters: ResourceId[];
    readonly max_per_dc: number;
    readonly min_per_dc: number;
}

export interface LoadBalance {
    readonly datacenter: ResourceId;
    readonly max: number;
    readonly min: number;
    readonly public_interface?: boolean;
}

export interface Persistent {
    readonly datacenter: string;
    readonly public_interface?: boolean;
}

export interface Volume {
    readonly id?: ResourceId;
    readonly volume_plan: string;
    readonly path: string;
    readonly remote_access: boolean;
}

export interface TLS {
    readonly enabled: boolean;
    readonly path: string;
}

export interface NewParams {
    name: string;
    environment: ResourceId;
    config: {
        flags?: Flags;
        tls?: TLS;
        dnsrecord?: ResourceId;
        runtime?: RuntimeConfig;
    };
    plan: ResourceId;
    image: ResourceId;
    scaling: Scaling;
    domain?: ResourceId;
    tls?: TLS;
    volumes: Volume[];
}

export interface UpdateParams {
    name?: string;
    volumes?: { id: ResourceId, remote_access: boolean }[];
}

export interface EventCollection extends CollectionDoc {
    readonly data: {
        readonly id: ResourceId;
        readonly type: string;
        readonly attributes: {
            readonly caption: string;
            readonly time: string;
            readonly platform: boolean,
            readonly type: string;
        }
    }[];
}

export interface CompatibleImages extends Images.Collection { }

export class CollectionRequest {
    private static target = "containers";

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
        this.target = `containers/${id}`;
    }

    public async get(query?: QueryParams) {
        return API.get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: QueryParams) {
        return API.patch<Single>(
            this.target,
            doc,
            query
        );
    }

    public async delete(query?: QueryParams) {
        return API.del<Single>(this.target, query);
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

    public async compatibleImages(query?: QueryParams) {
        return API.get<CompatibleImages>(`${this.target}/compatible-images`, query);
    }

    public task(t: Task<SingleActions>, query?: QueryParams) {
        return API.post<Task<SingleActions>>(
            `${this.target}/tasks`,
            t,
            query
        );
    }

    public async events(query?: QueryParams) {
        return API.get<EventCollection>(`${this.target}/events`, query);
    }

    public instances(): Instances.CollectionRequest;
    public instances(id: ResourceId): Instances.SingleRequest;
    public instances(id?: ResourceId): Instances.CollectionRequest | Instances.SingleRequest {
        if (id) {
            return new Instances.SingleRequest(this.id, id);
        }

        return new Instances.CollectionRequest(this.id);
    }
}
