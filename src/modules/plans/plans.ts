import * as API from "../../common/api";
import {
    CollectionDoc,
    SingleDoc,
    ResourceId,
    Resource,
    QueryParams,
} from "../../common/structures";


export function document(): typeof CollectionRequest;
export function document(id: ResourceId): SingleRequest;
export function document(id?: ResourceId): typeof CollectionRequest | SingleRequest {
    if (!id) {
        return CollectionRequest;
    }

    return new SingleRequest(id);
}

export interface Collection extends CollectionDoc {
    data: Plan[];
}

export interface Single extends SingleDoc {
    data: Plan | null;
}

export interface Plan extends Resource {
    name: string;
    public: boolean;
    resources: ResourceLimits;
    trial: boolean; // available in trial?
    most_popular: boolean;
    price: {
        month: number;
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
        base_size: number; // Container base image storage, in MB.
    };

    network: {
        private: number;
        public: number;
    };
}

export interface Summary {
    id: ResourceId;
    name: string;
    price: number;
}

export class CollectionRequest {
    public static async get(query?: QueryParams) {
        return API.get<Collection>("plans", query);
    }
}

export class SingleRequest {
    private target: string;

    constructor(id: ResourceId) {
        this.target = `plans/${id}`;
    }

    public async get(query?: QueryParams) {
        return API.get<Single>(this.target, query);
    }
}
