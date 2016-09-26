import * as JsonApi from "../../jsonapi/index";
import * as API from "../../common/api";
import { Id, State, Events, Task, Scope, FormattedDoc } from "../../common/structures";

export function document(): typeof CollectionRequest;
export function document(id: string): SingleRequest;
export function document(id?: string): typeof CollectionRequest | SingleRequest {
    if (!id) {
        return CollectionRequest;
    }

    return new SingleRequest(id);
}

export interface Collection extends JsonApi.CollectionDocument {
    data: Resource[];
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Resource extends JsonApi.Resource {
    id: Id;
    type: "images";
    attributes: {
        name: string;
        about: {
            description: string;
        };
        source: SourceStructure;
        tags: string[];
        size: number;
        config: ConfigStructure;
        state: State<States>;
        events: Events;
        owner: Scope;
    };

    relationships?: {
        creator: JsonApi.ToOneRelationship;
        repo: JsonApi.ToOneRelationship;
    };

    meta: {
        counts: {
            containers: number;
        };
    };
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
    flavor: string;
    type: string;
    target: string;
    repo: string;
    tag: string;
}

export interface ConfigStructure {
    hostname: string;
    user: string;
    env: { [key: string]: string };
    labels: { [key: string]: string };
    ports: ConfigPortStructure[];
    command: string[];
    entrypoint: string[];
    volumes: ConfigVolumeStructure[];
}

export interface ConfigPortStructure {
    type: string;
    number: number;
}

export interface ConfigVolumeStructure {
    path: string;
    mode: number;
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

export type CollectionActions = "cleanup";
export class CollectionRequest {
    public static dockerhub = new DockerHub();
    private static target = "images";

    public static async get(query?: API.QueryParams): API.Response<Collection> {
        return API.get<Collection>(this.target, query);
    }

    public static async create(doc: NewParams, query?: API.QueryParams): API.Response<Single> {
        return API.post<Single>(this.target, new FormattedDoc({ type: "images", attributes: doc }), query);
    }

    public static async deleteUnused(): API.Response<Task<CollectionActions>> {
        return API.post<Task<CollectionActions>>(`${this.target}/tasks`, new Task("cleanup"));
    }
}

export type SingleActions = "build";
export class SingleRequest {
    private target: string;

    constructor(private id: string) {
        this.target = `images/${id}`;
    }

    public async get(query?: API.QueryParams): API.Response<Single> {
        return API.get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: API.QueryParams): API.Response<Single> {
        return API.patch<Single>(this.target, new FormattedDoc({ id: this.id, type: "images", attributes: doc }), query);
    }

    public async delete(query?: API.QueryParams): API.Response<Task<SingleActions>> {
        return API.del<Task<SingleActions>>(this.target, query);
    }

    public async build(): API.Response<Task<"build">> {
        return this.task("build");
    }

    public async task(action: SingleActions, contents?: Object): API.Response<Task<SingleActions>> {
        return API.post<Task<SingleActions>>(`${this.target}/tasks`, new Task(action, contents));
    }
}

export class DockerHub {
    public async import(doc: DockerHubImportParams, query?: API.QueryParams): API.Response<Single> {
        return API.post<Single>(
            `images/dockerhub`,
            new FormattedDoc({ type: "images", attributes: doc }),
            query
        );
    }
}
