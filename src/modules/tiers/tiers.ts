import * as API from "common/api";
import {
    CollectionDoc,
    ResourceId,
    Resource,
    QueryParams
} from "common/structures";

export function document(): typeof CollectionRequest;
export function document(id: ResourceId): SingleRequest;
export function document(id?: ResourceId): typeof CollectionRequest | SingleRequest {
    if (!id) {
        return CollectionRequest;
    }

    return new SingleRequest(id);
}

export interface Collection extends CollectionDoc {
    data: Resource[];
    meta?: {
        structure?: {
            resources: MetaFeature[];
            support: MetaFeature[];
            features: MetaFeature[];
        }  
    };
}

export interface Single extends Resource {
    data: Tier | null;
}

export interface Tier extends Resource {
    name: string;
    public: boolean;
    most_popular: boolean;
    disabled: boolean;
    descriptors: {title: string, description: string, type: string}[];
    features: {[key: string]: boolean};
    resources: {[key: string]: number};
    support: {[key: string]: boolean};
    price: {
        month: number;
        custom: boolean;
    };
    release: string;
}

export interface MetaFeature {
    identifier: string;
    caption: string;
    description: string;
    extra_cost: {
        [key: string]: string;
    } | null;
}

export interface Summary {
    id: ResourceId;
    name: string;
    price: number;
}

export class CollectionRequest {
    private static target = "tiers";
    
    public static async get(query?: QueryParams) {
        return API.get<Collection>(this.target, query);    
    }
}

export class SingleRequest {
    private target: string;
    
    constructor(private id: ResourceId) {
        this.target = `tiers/${id}`;
    }

    public async get(query?: QueryParams) {
        return API.get<Single>(this.target, query);    
    }
}
