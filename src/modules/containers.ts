import * as JsonApi from "../jsonapi/index";
import * as ApiRequest from "../common/request";
import { Id, State, Events, Task, FormattedDoc } from "../common/structures";
import { InstanceCollection, Instance, InstanceLog, LogTypes } from "./instances";
import { ImageResource } from "./images";

// Init
export function document(): typeof ContainersRequest;
export function document(id: string): ContainerRequest;
export function document(id?: string): typeof ContainersRequest | ContainerRequest {
    if (id) {
        return new ContainerRequest(id);
    }

    return ContainersRequest;
}

// Container Response Documents
export interface ContainerCollection extends JsonApi.CollectionDocument {
    data: ContainerResource[];
}

export interface Container extends JsonApi.ResourceDocument {
    data: ContainerResource | null;
}

export interface ContainerResource extends JsonApi.Resource {
    id: Id;
    type: "containers";
    attributes: {
        name: string;
        env: { [key: string]: string };
        command: string[];
        spawns: number;
        scaling: ScalingStructure;
        volumes: ContainerVolumes[];
        override_command: boolean;
        state: State<ContainerState>;
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
        image?: ImageResource
        ip?: {
            address: string;
            mask: string;
        }
    };
}

export type ContainerState = "starting" | "running" | "stopping" | "stopped" | "deleting" | "deleted";

export interface ScalingStructure {
    method: "persistent" | "geodns" | "loadbalance" | "loadbalance-geodns";
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

export interface ContainerVolumes {
    id?: Id;
    volume_plan: string;
    path: string;
    remote_access: boolean;
}

export interface NewContainerParams {
    name: string;
    environment: Id;
    plan: Id;
    image: Id;
    scaling: ScalingStructure;
    domain?: Id;
    volumes: ContainerVolumes[];
}

export interface UpdateContainerParams {
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

export type ContainerActions = "start" | "stop" | "change_plan" | "change_hostname" | "change_domain" | "change_config";
export class ContainersRequest {
    private static target = "containers";

    public static async get(query?: ApiRequest.QueryParams): Promise<ContainerCollection> {
        return ApiRequest._get<ContainerCollection>(this.target, query);
    }

    public static async create(doc: NewContainerParams, query?: ApiRequest.QueryParams): Promise<Container> {
        return ApiRequest._post<Container>(this.target, generateNewContainerDoc(doc), query);
    }
}

// Single container document
export interface ContainerConfig {
    env?: { [key: string]: string };
    command?: string[];
    override_command?: boolean;
}

export class ContainerRequest {
    private target: string;

    constructor(private id: string) {
        this.target = `containers/${id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Container> {
        return ApiRequest._get<Container>(this.target, query);
    }

    public async update(doc: UpdateContainerParams, query?: ApiRequest.QueryParams): Promise<Container> {
        return ApiRequest._patch<Container>(this.target, new FormattedDoc({ id: this.id, type: "containers", attributes: doc }), query);
    }

    public async delete(query?: ApiRequest.QueryParams): Promise<Container> {
        return ApiRequest._delete<Container>(this.target, query);
    }

    public async start() {
        return this.tasks().create("start");
    }

    public async stop() {
        return this.tasks().create("stop");
    }

    public async changePlan(plan: string) {
        return this.tasks().create("change_plan", { plan: plan });
    }

    public async changeHostname(hostname: string) {
        return this.tasks().create("change_hostname", hostname);
    }

    public async changeDomain(domain: string) {
        return this.tasks().create("change_domain", { domain: domain });
    }

    public async changeConfig(config: ContainerConfig) {
        return this.tasks().create("change_config", config);
    }

    public tasks() {
        return {
            create: async (
                action: ContainerActions,
                contents?: Object, query?:
                    ApiRequest.QueryParams
            ): Promise<Task<ContainerActions>> => {
                return ApiRequest._post<Task<ContainerActions>>(
                    `${this.target}/tasks`,
                    new Task<ContainerActions>(action, contents),
                    query
                );
            }
        };
    }

    public events() {
        return {
            get: async (query?: ApiRequest.QueryParams): Promise<EventCollection> => {
                return ApiRequest._get<EventCollection>(`${this.target}/events`, query);
            }
        };
    }

    public instances(): InstancesRequest;
    public instances(id: string): InstanceRequest
    public instances(id?: string): any {
        if (id) {
            return new InstanceRequest(this.id, id);
        }

        return new InstancesRequest(this.id);
    }
}

// List of container instance documents
export class InstancesRequest {
    private target: string;

    constructor(container_id: string) {
        this.target = `containers/${container_id}/instances`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<InstanceCollection> {
        return ApiRequest._get<InstanceCollection>(this.target, query);
    }
}


export class InstanceRequest {
    private target: string;

    constructor(private container_id: string, private instance_id: string) {
        this.target = `containers/${container_id}/instances/${instance_id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Instance> {
        return ApiRequest._get<Instance>(this.target, query);
    }

    public log(type: LogTypes) {
        return {
            get: async (query?: ApiRequest.QueryParams): Promise<InstanceLog> => {
                return ApiRequest._get<InstanceLog>(`${this.target}/logs/${type}`, query);
            }
        };
    }
}

export function generateNewContainerDoc(attr: NewContainerParams) {
    let attributes = {
        name: attr.name,
        scaling: attr.scaling,
        volumes: attr.volumes,
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
