// tslint:disable-next-line
import { CycleErrorDetail, ResultFail, ResultSuccess } from "../../common/api";
import * as JsonApi from "../../jsonapi";
import * as API from "../../common/api";
import * as Instances from "./instances";
import * as Images from "../images";
import * as Plans from "../plans";
import * as Accounts from "../accounts";
import * as DNS from "../dns";
import { Id, State, Events, FormattedDoc, Task } from "../../common/structures";

/**
 * Entrypoint for interacting with containers API
 */
export function document(): typeof CollectionRequest;
export function document(id: Id): SingleRequest;
export function document(id?: Id): typeof CollectionRequest | SingleRequest {
    if (id) {
        return new SingleRequest(id);
    }

    return CollectionRequest;
}

/**
 * A JSON API Document containing a collection of containers 
 */
export interface Collection extends JsonApi.CollectionDocument {
    readonly data: Resource[];
}

/**
 * A JSON API Document containing a container resource
 */
export interface Single extends JsonApi.ResourceDocument {
    readonly data: Resource | null;
}

/**
 * An individual container resource
 */
export interface Resource extends JsonApi.Resource {
    readonly id: Id;
    readonly type: "containers";
    readonly attributes: {
        readonly name: string;
        readonly config: Config;
        readonly spawns: number;
        readonly scaling: Scaling;
        readonly volumes: Volume[];
        readonly state: State<States>;
        readonly events: Events;
    };
    readonly relationships?: {
        readonly environment: JsonApi.ToOneRelationship;
        readonly image: JsonApi.ToOneRelationship;
        readonly plan: JsonApi.ToOneRelationship;
        readonly domain: JsonApi.ToOneRelationship;
    };
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
        readonly image?: Images.Resource;
        readonly ip?: {
            readonly address: string;
            readonly mask: string;
        },
        readonly plan?: Plans.Resource;
        readonly domain?: DNS.Records.Resource
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
    domain?: Id | null;
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
    dnsrecord: Id | null;
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
    volumes: Volume[];
}

export interface UpdateParams {
    name?: string;
    volumes?: { id: Id, remote_access: boolean }[];
}

export interface EventCollection extends JsonApi.CollectionDocument {
    readonly data: EventResource[];
}

export interface EventResource extends JsonApi.Resource {
    id: Id;
    type: string;
    attributes: {
        caption: string;
        time: string;
        platform: boolean,
        type: string;
    };
    meta: {
        creator: Accounts.Resource;
    };
}

export interface CompatibleImages extends Images.Collection { }

export class CollectionRequest {
    private static target = "containers";

    public static async get(query?: API.QueryParams) {
        return API.get<Collection>(this.target, query);
    }

    public static async create(doc: NewParams, query?: API.QueryParams) {
        return API.post<Single>(this.target, generateNewContainerDoc(doc), query);
    }
}

export class SingleRequest {
    private target: string;

    constructor(private id: Id) {
        this.target = `containers/${id}`;
    }

    public async get(query?: API.QueryParams) {
        return API.get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: API.QueryParams) {
        return API.patch<Single>(
            this.target,
            new FormattedDoc({ id: this.id, type: "containers", attributes: doc }),
            query
        );
    }

    public async delete(query?: API.QueryParams) {
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

    public async compatibleImages(query?: API.QueryParams) {
        return API.get<CompatibleImages>(`${this.target}/compatible-images`, query);
    }

    public task(t: Task<SingleActions>, query?: API.QueryParams) {
        return API.post<Task<SingleActions>>(
            `${this.target}/tasks`,
            t,
            query
        );
    }

    public async events(query?: API.QueryParams) {
        return API.get<EventCollection>(`${this.target}/events`, query);
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
        }
    };

    return new FormattedDoc({ type: "containers", attributes: attributes, relationships: relationships });
}
