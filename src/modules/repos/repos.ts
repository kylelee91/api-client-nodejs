import * as JsonApi from "../../jsonapi/index";
import * as ApiRequest from "../../common/request";
import { Id, State, Events, Task, FormattedDoc, Scope } from "../../common/structures";

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
    data: Resource;
}

export interface Resource extends JsonApi.Resource {
    id: Id;
    type: "repos";
    attributes: {
        name: string;
        about: {
            description: string;
        };
        type: Types;
        owner: Scope;
        url: string;
        auth: {
            private_key: string;
        };
        state: State<States>;
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

export type States = "live" | "building" | "deleting" | "deleted" | "error";

export type Types = "git";

export interface NewParams {
    name: string;
    url: string;
    type: Types;
    auth?: {
        private_key: string;
    };
}

export interface UpdateParams {
    name?: string;
    auth?: {
        private_key: string;
    };
}

export interface BuildParams {
    latest: boolean;
    commit: string;
    description: string;
}

export class CollectionRequest {
    private static target = "repos";

    public static async get(query?: ApiRequest.QueryParams): Promise<Collection> {
        return ApiRequest._get<Collection>(this.target, query);
    }

    public static async create(doc: NewParams, query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._post<Single>(
            this.target,
            new FormattedDoc({ type: "repos", attributes: doc }),
            query
        );
    }
}

export type SingleActions = "build";
export class SingleRequest {
    private target: string;

    constructor(private id: string) {
        this.target = `repos/${id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._patch<Single>(this.target, new FormattedDoc({ type: "repos", attributes: doc }), query);
    }

    public async delete(query?: ApiRequest.QueryParams): Promise<Task<SingleActions>> {
        return ApiRequest._delete<Task<SingleActions>>(this.target, query);
    }

    public async build(options: BuildParams) {
        return this.tasks().create("build", options);
    }

    public tasks() {
        return {
            create: async (action: SingleActions, contents?: Object): Promise<Task<SingleActions>> => {
                return ApiRequest._post<Task<SingleActions>>(`${this.target}/tasks`, new Task(action, contents));
            }
        };
    }
}

