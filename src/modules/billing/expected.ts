import * as API from "common/api";
import { Term } from "./common";
import { 
    SingleDoc, 
    Resource, 
    ResourceId, 
} from "common/structures";

export function document() {
    return SingleRequest;
}

export interface Single extends SingleDoc {
    data: Expected | null;
}

export interface Expected extends Resource {
    id: ResourceId;
    costs: number;
    term: Term;
}

export class SingleRequest {
    private static target = "billing/expected";

    public static async get() {
        return API.get<Single>(this.target);
    }
}
