import * as JsonApi from "../../jsonapi/index";
import * as ApiRequest from "../../common/request";
import { Id } from "../../common/structures";

export function document(): typeof CollectionRequest;
export function document(id: string): SingleRequest;
export function document(id?: string): typeof CollectionRequest | SingleRequest {
    if (!id) {
        return CollectionRequest;
    }

    return new SingleRequest(id);
}

export interface Collection extends JsonApi.CollectionDocument {
    data: Resource[];
    meta: {
        structure: {
            resources: MetaFeature[];
            support: MetaFeature[];
            features: MetaFeature[];
        }  
    };
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Resource {
    id: Id;
    type: "tiers";
    attributes: {
        name: string;
        public: boolean;
        most_popular: boolean;
        disabled: boolean;
        descriptors: {title: string, description: string, type: string}[];
        features: {[key: string]: boolean}
        resources: {[key: string]: number}
        support: {[key: string]: boolean};
        price: {
            month: number;
            custom: boolean;
        },
        release: string;
    };
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
    id: string;
    name: string;
    price: number;
}

export class CollectionRequest {
    private static target = "tiers";
    
    public static async get(query?: ApiRequest.QueryParams): Promise<Collection> {
        return ApiRequest._get<Collection>(this.target, query);    
    }
}

export class SingleRequest {
    private target: string;
    
    constructor(private id: string) {
        this.target = `tiers/${id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._get<Single>(this.target, query);    
    }
}
