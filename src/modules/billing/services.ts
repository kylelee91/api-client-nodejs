import * as API from "../../common/api";
import * as Plans from "../plans/index";
import * as Tiers from "../tiers/tiers";
import { Term, ContainerLineItem } from "./common";
import { 
    SingleDoc, 
    Resource,
    QueryParams
} from "../../common/structures";
import { Environment } from "../environments";

export function document() {
    return SingleRequest;
}

export interface Single extends SingleDoc {
    data: Service | null;
    includes?: {
        environments: {[key: string]: Environment}
    };
}

export interface Service extends Resource {
    term: Term;
    containers: ContainerLineItem[];
    due: number;
    tier: Tiers.Summary & {due: number};
    resource_pools: ResourcePools;
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

    public static async get(query?: QueryParams) {
        return API.get<Single>(this.target, query);
    }
}
