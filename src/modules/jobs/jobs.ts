import * as JsonApi from "../../jsonapi/index";
import * as ApiRequest from "../../common/request";
import * as Tasks from "./tasks";
import { Id, Time, State, Events, Scope } from "../../common/structures";

export function document(): typeof CollectionRequest;
export function document(id: string): SingleRequest;
export function document(id?: string): CollectionRequest | SingleRequest {
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

export interface Resource {
    id: Id;
    type: "jobs";
    attributes: {
        expires: Time;
        queue: string;
        caption: string;
        schedule: Time;
        state: State<States>;
        tasks: Tasks.Resource[];
        owner: Scope;
        events: Events & {
            created: Time;
            queued: Time;
            started: Time;
            completed: Time;
        };
    };
    relationships?: {
        creator: JsonApi.ToOneRelationship;
    };
}

export type States = "new" | "running" | "expired" | "completed";

export class CollectionRequest {
    public static async get(query?: ApiRequest.QueryParams): Promise<Collection> {
        return ApiRequest._get<Collection>("jobs", query);
    }
}

export class SingleRequest {
    private target: string;

    constructor(id: string) {
        this.target = `jobs/${id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._get<Single>(this.target, query);
    }
}

