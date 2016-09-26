// tslint:disable-next-line
import { ErrorDetail, ResultFail, ResultSuccess } from "../../common/api";
import * as JsonApi from "../../jsonapi/index";
import * as API from "../../common/api";
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

export type States = "new" | "running" | "expired" | "completed" | "queued" | "error" | "scheduled";

export class CollectionRequest {
    public static async get(query?: API.QueryParams) {
        return API.get<Collection>("jobs", query);
    }
}

export class SingleRequest {
    private target: string;

    constructor(id: string) {
        this.target = `jobs/${id}`;
    }

    public async get(query?: API.QueryParams){
        return API.get<Single>(this.target, query);
    }
}

