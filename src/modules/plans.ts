import * as JsonApi from "../jsonapi/index";
import * as ApiRequest from "../common/request";
import { Id } from "../common/structures";

export function document(): typeof PlansRequest;
export function document(id: string): PlanRequest;
export function document(id?: string): typeof PlansRequest | PlanRequest {
    if (!id) {
        return PlansRequest;
    }

    return new PlanRequest(id);
}

export function volumes() {
    return {
        get: async (query?: ApiRequest.QueryParams): Promise<VolumeCollection> => {
            return ApiRequest._get<VolumeCollection>("plans/volumes", query);
        }
    };
}

export interface PlanCollection extends JsonApi.CollectionDocument {
    data: PlanResource[];
}

export interface Plan extends JsonApi.ResourceDocument {
    data: PlanResource;
}

export interface PlanResource extends JsonApi.Resource {
    id: Id;
    type: "plans";
    attributes: {
        name: string;
        public: boolean;
        resources: PlanResourceLimits;
        most_popular: boolean;
        price: {
            month: string;
        };
    };
}

export interface PlanResourceLimits {
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

export interface PlanSummary {
    id: string;
    name: string;
    price: number;
}

export interface VolumeCollection extends JsonApi.CollectionDocument {
    data: VolumeResource[];
}

export interface Volume extends JsonApi.ResourceDocument {
    data: VolumeResource | null;
}

export interface VolumeResource extends JsonApi.Resource {
    id: Id;
    type: "volume_plan";
    attributes: {
        name: string;
        local: boolean;
        price: {
            month: number;
        };

        public: boolean;
        resources: {
            storage: number;
        };
        type: string;
    };
}

export class PlansRequest {
    public static async get(query?: ApiRequest.QueryParams): Promise<PlanCollection> {
        return ApiRequest._get<PlanCollection>("plans", query);
    }
}

export class PlanRequest {
    private target: string;

    constructor(id: string) {
        this.target = `plans/${id}`;
    }
}
