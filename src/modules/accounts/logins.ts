import * as JsonApi from "../../jsonapi/index";
import { Id } from "../../common/structures";

export interface Collection extends JsonApi.CollectionDocument {
    data: Resource[];
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Resource {
    id: Id;
    type: string;
    attributes: {
        account: string;
        time: string;
        success: string;
    };
}
