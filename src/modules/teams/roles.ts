import * as API from "../../common/api";
import {
    CollectionDoc,
    SingleDoc,
    Resource,
    QueryParams
} from "../../common/structures";

export function document() {
    return RolesResponse;
}

export interface Collection extends CollectionDoc {
    data: Role[];
}

export interface Single extends SingleDoc {
    data: Role | null;
}

export interface Role extends Resource {
    name: string;
}

export enum Names {
    Owner = 2,
    Admin = 4,
    Developer = 8,
    Analyst = 16
}


export class RolesResponse {
    public static async get(query?: QueryParams) {
        return API.get<Collection>(`teams/roles`, query);
    }
}
