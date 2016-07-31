import * as JsonApi from "../jsonapi/index";
import { Id } from "../common/structures";
import * as ApiRequest from "../common/request";

export function document(): typeof DataCentersRequest;
export function document(id: string): DataCenterRequest;
export function document(id?: string): typeof DataCentersRequest | DataCenterRequest {
    if (!id) {
        return DataCentersRequest;
    }

    return new DataCenterRequest(id);
}

export interface DataCenterCollection extends JsonApi.CollectionDocument {
    data: DataCenterResource[];
}

export interface DataCenter extends JsonApi.ResourceDocument {
    data: DataCenterResource | null;
}

export interface DataCenterResource extends JsonApi.Resource {
    id: Id;
    type: "datacenters";
    attributes: {
        name: string;
        provider: string;
        location: {
            state: string;
            city: string;
            country: string;
            continent: string;
        };
        active: boolean;
    };
}

export class DataCentersRequest {
    public static async get(query?: ApiRequest.QueryParams): Promise<DataCenterCollection> {
        return ApiRequest._get<DataCenterCollection>("datacenters", query);
    }
}

export class DataCenterRequest {
    private target: string;

    constructor(id: string) {
        this.target = `datacenters/${id}`;
    }
}
