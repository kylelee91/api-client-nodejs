import * as API from "../../common/api";
import {
    CollectionDoc,
    SingleDoc,
    Resource,
    ResourceId,
    QueryParams
} from "../../common/structures";

export function domains(query?: QueryParams) {
    return API.get<Collection>("dns/domains", query);
}

export interface Collection extends CollectionDoc {
    data: Record[];
}

export interface Single extends SingleDoc {
    data: Record | null;
}

export interface Record extends Resource {
    id: ResourceId;
    container: ResourceId;
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
}

export interface Record {
    id: ResourceId;
    type: Types;
    assignable: boolean;
    ssl?: boolean; // For A Records
    name: string;
    domain: string;
    container: string;
    values: {
        ip?: string;
        priority?: number;
        domain?: string;
        text?: string;
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
    id: ResourceId;
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

    constructor(zoneId: ResourceId) {
        this.target = `dns/zones/${zoneId}/records`;
    }

    public async get(query?: QueryParams) {
        return API.get<Collection>(this.target, query);
    }

    public async create(doc: NewParams, query?: QueryParams) {
        return API.post<Single>(this.target, doc, query);
    }
}

export class SingleRequest {
    private target: string;

    constructor(zoneId: ResourceId, private recordId: ResourceId) {
        this.target = `dns/zones/${zoneId}/records/${recordId}`;
    }

    public async get(query?: QueryParams) {
        return API.get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: QueryParams) {
        return API.patch<Single>(this.target, doc, query);
    }

    public async delete() {
        return API.del<Single>(this.target);
    }
}
