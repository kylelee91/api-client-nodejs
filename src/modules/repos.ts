import * as JsonApi from "../jsonapi/index";
import * as ApiRequest from "../common/request";
import { Id, State, Events, Task, FormattedDoc, Scope } from "../common/structures";

export function document(): typeof ReposRequest;
export function document(id: string): RepoRequest;
export function document(id?: string): typeof ReposRequest | RepoRequest {
    if (!id) {
        return ReposRequest;
    }

    return new RepoRequest(id);
}

export interface RepoCollection extends JsonApi.CollectionDocument {
    data: RepoResource[];
}

export interface Repo extends JsonApi.ResourceDocument {
    data: RepoResource;
}

export type RepoState = "live" | "building" | "deleting" | "deleted" | "error";
export type RepoType = "git";
export interface RepoResource extends JsonApi.Resource {
    id: Id;
    type: "repos";
    attributes: {
        name: string;
        about: {
            description: string;
        };
        type: RepoType;
        owner: Scope;
        url: string;
        auth: {
            private_key: string;
        };
        state: State<RepoState>;
        events: Events;
    };

    relationships?: {
        creator: JsonApi.ToOneRelationship;
    };

    meta?: {
        counts: {};
        account: {};
        team: {};
    };
}

export interface NewRepoParams {
    name: string;
    url: string;
    type: RepoType;
    auth?: {
        private_key: string;
    }; 
}

export interface UpdateRepoParams {
    name?: string;
    auth?: {
        private_key: string;
    };
}

export class ReposRequest {
    private static target = "repos";

    public static async get(query?: ApiRequest.QueryParams): Promise<RepoCollection> {
        return ApiRequest._get<RepoCollection>(this.target, query);
    }

    public static async create(doc: NewRepoParams, query?: ApiRequest.QueryParams): Promise<Repo> {
        return ApiRequest._post<Repo>(this.target, new FormattedDoc({type: "repos", attributes: doc}), query);
    }
}

export interface BuildParams {
    latest: boolean;
    commit: string;
    description: string;
}

export type RepoActions = "build";
export class RepoRequest {
    private target: string;

    constructor(private id: string) {
        this.target = `repos/${id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Repo> {
        return ApiRequest._get<Repo>(this.target, query);
    }

    public async update(doc: UpdateRepoParams, query?: ApiRequest.QueryParams): Promise<Repo> {
        return ApiRequest._patch<Repo>(this.target, new FormattedDoc({type: "repos", attributes: doc}), query);
    }

    public async delete(query?: ApiRequest.QueryParams): Promise<Task<RepoActions>> {
        return ApiRequest._delete<Task<RepoActions>>(this.target, query);
    }

    public async build(options: BuildParams) {
        return this.tasks().create("build", options);
    }

    public tasks() {
        return {
            create: async (action: RepoActions, contents?: Object): Promise<Task<RepoActions>> => {
                return ApiRequest._post<Task<RepoActions>>(`${this.target}/tasks`, new Task(action, contents));
            }
        };
    }
}

