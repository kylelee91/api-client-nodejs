import * as JsonApi from "../../jsonapi/index";
import * as ApiRequest from "../../common/request";
import * as Plans from "../plans/index";
import * as Tiers from "../tiers/tiers";
import { Term, ContainerLineItem } from "./common";
import { Id } from "../../common/structures";

export function document() {
    return SingleRequest;
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resources | null;
}

export interface Resources {
    id: Id;
    type: "active_services";
    attributes: {
        term: Term;
        containers: ContainerLineItem[];
        due: number;
        tier: Tiers.Summary & {due: number};
        resource_pools: ResourcePools
    };
    meta: {
        environments: {[key: string]: {name: string, id: Id}};
    };
}

export interface ResourcePools {
    image_storage: ResourceItem;
    bandwidth: ResourceItem;
}

export interface ResourceItem {
    allowed: number;
    used: number;
    due: number;
}

export interface Volumes {
    path: string;
    plan: Plans.Summary;
    due: number;
}

export class SingleRequest {
    private static target = `billing/current`;

    public static async get(query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._get<Single>(this.target, query);
    }
}
