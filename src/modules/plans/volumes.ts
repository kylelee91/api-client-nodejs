import * as JsonApi from "../../jsonapi/index";
import * as ApiRequest from "../../common/request";
import { Id } from "../../common/structures";

export function document() {
    return {
        get: async (query?: ApiRequest.QueryParams): Promise<Collection> => {
            return ApiRequest._get<Collection>("plans/volumes", query);
        }
    };
}

export interface Collection extends JsonApi.CollectionDocument {
    data: Resource[];
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Resource extends JsonApi.Resource {
    id: Id;
    type: "volume_plan";
    attributes: {
        name: string;
        local: boolean;
        price: {
            month: number;
        };

        public: boolean;
        resources: {
            storage: number;
        };
        type: string;
    };
}
