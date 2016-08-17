import * as JsonApi from "../../jsonapi/index";
import * as ApiRequest from "../../common/request";
import { Id } from "../../common/structures";

export function document() {
    return ExpectedRequest;
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Resource {
    id: Id;
    type: "expected";
    attributes: {
        costs: number;
    };
}

export class ExpectedRequest {
    private static target = "billing/expected";

    public static async get(): Promise<Single> {
        return ApiRequest._get<Single>(this.target);
    }
}
