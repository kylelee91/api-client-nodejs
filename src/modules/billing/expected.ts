import * as JsonApi from "../../jsonapi/index";
import * as API from "../../common/api";
import { Term } from "./common";
import { Id } from "../../common/structures";

export function document() {
    return SingleRequest;
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Resource {
    id: Id;
    type: "expected";
    attributes: {
        costs: number;
        term: Term;
    };
}

export class SingleRequest {
    private static target = "billing/expected";

    public static async get(): API.Response<Single> {
        return API.get<Single>(this.target);
    }
}
