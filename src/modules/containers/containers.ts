import * as API from "../../common/api";
import * as Instances from "./instances";
import * as Images from "../images";
import * as Plans from "../plans";
import * as Dns from "../dns";
import * as Accounts from "../accounts";
import {
    CollectionDoc,
    SingleDoc,
    Resource,
    ResourceId,
    State,
    NewTask,
    Task,
    Events,
    QueryParams
} from "../../common/structures";

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
    data: Container[];
    includes?: {
        images: { [key: string]: Images.Image };
        plans: { [key: string]: Plans.Plan };
    };
}

/**
 * A JSON API Document containing a container resource
 */
export interface Single extends SingleDoc {
    data: Container | null;
    includes?: {
        images: { [key: string]: Images.Image }
        plans: { [key: string]: Plans.Plan };
        domains: { [key: string]: Dns.Records.Record }
    };
}

/**
 * An individual container resource
 */
export interface Container extends Resource {
    name: string;
    config: Config;
    spawns: number;
    scaling: Scaling;
    volumes: Volume[];
    state: State<States>;
    events: Events;
    environment: ResourceId;
    image: ResourceId;
    plan: ResourceId;
    domain: ResourceId;
    meta?: {
        instances: {
            starting: number;
            running: number;
            stopping: number;
            stopped: number;
            deleting: number;
            deleted: number;
        },
        public_ip?: {
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
    plan?: ResourceId;
    domain?: ResourceId | null;
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
    dnsrecord: ResourceId | null;
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
    datacenters: ResourceId[];
    max_per_dc: number;
    min_per_dc: number;
}

export interface LoadBalance {
    datacenter: ResourceId;
    max: number;
    min: number;
    public_interface?: boolean;
}

export interface Persistent {
    datacenter: string;
    public_interface?: boolean;
}

export interface Volume {
    id?: ResourceId;
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
    environment: ResourceId;
    config: {
        flags?: Flags;
        tls?: TLS;
        dnsrecord?: ResourceId | null;
        runtime?: RuntimeConfig;
    };
    plan: ResourceId;
    image: ResourceId;
    scaling: Scaling;
    volumes: Volume[];
}

export interface UpdateParams {
    name?: string;
    volumes?: { id: ResourceId, remote_access: boolean }[];
}

export interface EventCollection extends CollectionDoc {
    data: Event[];
    includes?: {
        creators: {[key: string]: Accounts.Account}
    };
}

export interface Event {
    id: ResourceId;
    type: string;
    caption: string;
    time: string;
    platform: boolean;
    creator: ResourceId;
    container: ResourceId;
    instance?: ResourceId;
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
        return this.task(new NewTask<"start">("start"));
    }

    public async stop() {
        return this.task(new NewTask<"stop">("stop"));
    }

    public async apply(mods: ModifyTaskParams) {
        return this.task(new NewTask<"apply">("apply", mods));
    }

    public async reimage(params: ReimageParams) {
        return this.task(new NewTask<"reimage">("reimage", params));
    }

    public async compatibleImages(query?: QueryParams) {
        return API.get<CompatibleImages>(`${this.target}/compatible-images`, query);
    }

    public task(t: NewTask<SingleActions>, query?: QueryParams) {
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
