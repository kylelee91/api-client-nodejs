import * as JsonApi from "../../jsonapi/index";
import * as API from "../../common/api";
import { Id } from "../../common/structures";

export function document() {
    return RolesResponse;
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


export class RolesResponse {
    public static async get(query?: API.QueryParams): API.Response<Collection> {
        return API.get<Collection>(`teams/roles`, query);
    }
}
