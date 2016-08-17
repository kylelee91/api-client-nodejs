import * as JsonApi from "../../jsonapi/index";
import * as ApiRequest from "../../common/request";
import { Id } from "../../common/structures";

export function document() {
    return {
        get: async (query?: ApiRequest.QueryParams): Promise<Collection> => {
            return ApiRequest._get<Collection>(`teams/roles`, query);
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
    type: string;
    attributes: {
        name: string;
    };
}

export enum Names {
    Owner = 1,
    Admin = 2,
    Developer = 4,
    Analyst = 8
}

