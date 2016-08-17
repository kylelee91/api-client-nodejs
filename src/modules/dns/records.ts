import * as JsonApi from "../../jsonapi/index";
import * as ApiRequest from "../../common/request";
import { Id, FormattedDoc } from "../../common/structures";

export function document() {
    return {
        get: async (query?: ApiRequest.QueryParams): Promise<Collection> => {
            return ApiRequest._get<Collection>("dns/domains", query);
        }
    };
}

export interface Collection extends JsonApi.CollectionDocument {
    data: Resource[];
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Resource {
    id: Id;
    type: "records";
    attributes: {
        type: Types;
        assignable: boolean;
        ssl?: boolean; // For A Records
        name: string;
        domain: string;
        values: {
            ip?: string;
            priority?: number;
            domain?: string;
            text?: string;
        };
    };

    relationships?: {
        container: JsonApi.ToOneRelationship;
    };
}

export type Types = "a" | "aaaa" | "cname" | "mx" | "srv" | "ns" | "txt";

export interface NewParams {
    type: Types;
    assignable: boolean;
    name: string;
    ssl?: boolean;
    values: {
        ip?: string;
        priority?: number;
        domain?: string;
        text?: string;
    };
}

export interface UpdateParams {
    id: Id;
    type?: Types;
    assignable?: boolean;
    name?: string;
    domain?: string;
    ssl?: boolean;
    values?: {
        ip?: string;
        priority?: number;
        domain?: string;
        text?: string;
    };
}

export class CollectionRequest {
    private target: string;

    constructor(zoneId: Id) {
        this.target = `dns/zones/${zoneId}/records`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Collection> {
        return ApiRequest._get<Collection>(this.target, query);
    }

    public async create(doc: NewParams, query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._post<Single>(this.target, new FormattedDoc({ type: "records", attributes: doc }), query);
    }
}

export class SingleRequest {
    private target: string;

    constructor(zoneId: string, private recordId: string) {
        this.target = `dns/zones/${zoneId}/records/${recordId}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._patch<Single>(
            this.target,
            new FormattedDoc({ id: this.recordId, type: "records", attributes: doc }),
            query
        );
    }

    public async delete() {
        return ApiRequest._delete(this.target);
    }
}
