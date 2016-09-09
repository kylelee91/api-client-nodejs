import * as JsonApi from "../../jsonapi/index";
import { Id, Scope, Time, Events, State } from "../../common/structures";
import * as ApiRequest from "../../common/request";

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
    meta: CollectionMeta;
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Resource extends JsonApi.Resource {
    id: Id;
    type: "notifications";
    attributes: {
        code: string;
        url: string;
        message: string;
        owner: Scope;
        creator: Id;
        events: Events & {read: Time};
        state: State<States>
    };
}

export interface CollectionMeta {
    unread: number;
}

export type States = "new" | "read" | "hidden";

export class CollectionRequest {
    public static async get(query?: ApiRequest.QueryParams): Promise<Collection> {
        return ApiRequest._get<Collection>("notifications", query);
    }
}

export class SingleRequest {
    private target: string;

    constructor(id: string) {
        this.target = `notifications/${id}`;
    }
}
