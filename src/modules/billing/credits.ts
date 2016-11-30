import * as API from "../../common/api";
import { 
    CollectionDoc, 
    SingleDoc, 
    Resource, 
    Time, 
    Scope, 
    QueryParams
} from "../../common/structures";

export function document(): typeof CollectionRequest {
    return CollectionRequest;
}

export interface Collection extends CollectionDoc {
    data: Credit[];
}

export interface Single extends SingleDoc {
    data: Credit | null;
    meta: {
        total: number;
    };
}

export interface Credit extends Resource {
    owner: Scope;
    reason: string;
    amount: {
        initial: number;
        remaining: number;
    };
    issued: Time;
    expired: Time;
}

export class CollectionRequest {
    private static target = "billing/credits";

    public static async get(query?: QueryParams) {
        return API.get<Collection>(this.target, query);
    }
}
