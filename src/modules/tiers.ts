import * as JsonApi from "../jsonapi/index";
import * as ApiRequest from "../common/request";
import { Id } from "../common/structures";

export function document(): typeof TiersRequest;
export function document(id: string): TierRequest;
export function document(id?: string): typeof TiersRequest | TierRequest {
    if (!id) {
        return TiersRequest;
    }

    return new TierRequest(id);
}

export interface TierCollection extends JsonApi.CollectionDocument {
    data: TierResource[];
    meta: {
        structure: {
            resources: MetaTierFeature[];
            support: MetaTierFeature[];
            features: MetaTierFeature[];
        }  
    };
}

export interface Tier extends JsonApi.ResourceDocument {
    data: TierResource | null;
}

export interface TierResource {
    id: Id;
    type: "tiers";
    attributes: {
        name: string;
        public: boolean;
        most_popular: boolean;
        disabled: boolean;
        features: {[key: string]: boolean}
        resources: {[key: string]: number}
        support: {[key: string]: boolean};
        price: {
            month: number;
            custom: boolean;
        }
    };
}

export interface MetaTierFeature {
    identifier: string;
    caption: string;
    description: string;
    extra_cost: {
        [key: string]: string;
    } | null;
}

export interface TierSummary {
    id: string;
    name: string;
    price: number;
}

export class TiersRequest {
    private static target = "tiers";
    
    public static async get(query?: ApiRequest.QueryParams): Promise<TierCollection> {
        return ApiRequest._get<TierCollection>(this.target, query);    
    }
}

export class TierRequest {
    private target: string;
    
    constructor(private id: string) {
        this.target = `tiers/${id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Tier> {
        return ApiRequest._get<Tier>(this.target, query);    
    }
}
