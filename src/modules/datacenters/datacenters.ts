import * as API from "../../common/api";
import {
    CollectionDoc,
    SingleDoc,
    Resource,
    ResourceId,
    QueryParams
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
    data: DataCenter[];
}

export interface Single extends SingleDoc {
    data: DataCenter | null;
}

export interface DataCenter extends Resource {
    name: string;
    provider: string;
    location: LocationStructure;
    active: boolean;
}

export interface LocationStructure {
    state: string;
    city: string;
    country: string;
    continent: string;
    coordinates: number[];
}

export class CollectionRequest {
    public static async get(query?: QueryParams) {
        return API.get<Collection>("datacenters", query);
    }
}

export class SingleRequest {
    private target: string;

    constructor(id: ResourceId) {
        this.target = `datacenters/${id}`;
    }
}
