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
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource;
}

export interface Resource extends JsonApi.Resource {
    id: Id;
    type: "plans";
    attributes: {
        name: string;
        public: boolean;
        resources: ResourceLimits;
        most_popular: boolean;
        price: {
            month: string;
        };
    };
}

export interface ResourceLimits {
    ram: {
        limit: number;
        reserve: number;
        swap: number;
    };

    cpu: {
        period: number;
        quota: number;
    };

    storage: {
        read: number;
        write: number;
    };

    network: {
        private: number;
        public: number;
    };
}

export interface Summary {
    id: string;
    name: string;
    price: number;
}

export class CollectionRequest {
    public static async get(query?: ApiRequest.QueryParams): Promise<Collection> {
        return ApiRequest._get<Collection>("plans", query);
    }
}

export class SingleRequest {
    private target: string;

    constructor(id: string) {
        this.target = `plans/${id}`;
    }
}
