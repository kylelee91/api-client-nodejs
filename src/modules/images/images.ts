import * as API from "common/api";
import {
    CollectionDoc,
    SingleDoc,
    Resource,
    ResourceId,
    QueryParams,
    State,
    Events,
    Task,
    Scope
} from "common/structures";

export function document(): typeof CollectionRequest;
export function document(id: ResourceId): SingleRequest;
export function document(id?: ResourceId): typeof CollectionRequest | SingleRequest {
    if (!id) {
        return CollectionRequest;
    }

    return new SingleRequest(id);
}

export interface Collection extends CollectionDoc {
    data: Image[];
}

export interface Single extends SingleDoc {
    data: Image | null;
}

export interface Image extends Resource {
    readonly id: ResourceId;
    readonly name: string;
    readonly about: {
        readonly description: string;
    };
    readonly source: SourceStructure;
    readonly tags: string[];
    readonly size: number;
    readonly config: ConfigStructure;
    readonly state: State<States>;
    readonly events: Events;
    readonly owner: Scope;
    readonly creator: ResourceId;
    readonly repo: ResourceId;
    readonly meta?: {
        readonly counts?: {
            readonly containers: number;
        };
    };
}

export interface BuildLog extends Resource {
    readonly id: ResourceId;
    readonly image: ResourceId;
    readonly owner: Scope;
    readonly output: string;
    readonly Events: Events;
}

export type States =
    "new"
    | "claimed"
    | "downloading"
    | "building"
    | "verifying"
    | "saving"
    | "live"
    | "deleting"
    | "deleted"
    | "error";

export interface SourceStructure {
    readonly flavor: string;
    readonly type: string;
    readonly target: string;
    readonly repo: string;
    readonly tag: string;
}

export interface ConfigStructure {
    readonly hostname: string;
    readonly user: string;
    readonly env: { [key: string]: string };
    readonly labels: { [key: string]: string };
    readonly ports: ConfigPortStructure[];
    readonly command: string[];
    readonly entrypoint: string[];
    readonly volumes: ConfigVolumeStructure[];
}

export interface ConfigPortStructure {
    type: string;
    number: number;
}

export interface ConfigVolumeStructure {
    readonly path: string;
    readonly mode: number;
}

export interface NewParams {

}

export interface DockerHubImportParams {
    name: string; // >4 chars
    about?: {
        description: string;
    };
    repo: string;
    tag: string;
    auth?: {
        require: boolean;
        username: string;
        password: string;
        server: string;
    };
};

export interface UpdateParams {
    name?: string;
    about?: {
        description: string;
    };
}

export class DockerHub {
    public async import(doc: DockerHubImportParams, query?: QueryParams) {
        return API.post<Single>(`images/dockerhub`, doc, query);
    }
}

export type CollectionActions = "cleanup";
export class CollectionRequest {
    public static dockerhub = new DockerHub();
    private static target = "images";

    public static async get(query?: QueryParams) {
        return API.get<Collection>(this.target, query);
    }

    public static async create(doc: NewParams, query?: QueryParams) {
        return API.post<Single>(this.target, doc, query);
    }

    public static async deleteUnused() {
        return API.post<Task<CollectionActions>>(`${this.target}/tasks`, new Task("cleanup"));
    }
}

export type SingleActions = "build";
export class SingleRequest {
    private target: string;

    constructor(private id: ResourceId) {
        this.target = `images/${id}`;
    }

    public async get(query?: QueryParams) {
        return API.get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: QueryParams) {
        return API.patch<Single>(this.target, doc, query);
    }

    public async delete(query?: QueryParams) {
        return API.del<Task<SingleActions>>(this.target, query);
    }

    public async build() {
        return this.task("build");
    }

    public async log(query?: QueryParams) {
        return API.get<BuildLog>(`${this.target}/build-logs`, query);
    }

    public async task(action: SingleActions, contents?: Object) {
        return API.post<Task<SingleActions>>(`${this.target}/tasks`, new Task(action, contents));
    }
}
