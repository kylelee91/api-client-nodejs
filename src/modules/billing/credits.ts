import * as JsonApi from "../../jsonapi/index";
import * as API from "../../common/api";
import { Id, Time, Scope } from "../../common/structures";

export function document(): typeof CollectionRequest {
    return CollectionRequest;
}

export interface Collection extends JsonApi.CollectionDocument {
    data: Resource[];
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Resource {
    id: Id;
    type: "billing_methods";
    attributes: {
        owner: Scope;
        reason: string;
        amount: {
            initial: number;
            remaining: number;
        }
        issued: Time;
        expired: Time;
    };
}

export class CollectionRequest {
    private static target = "billing/credits";

    public static async get(query?: API.QueryParams): API.Response<Collection> {
        return API.get<Collection>(this.target, query);
    }
}
