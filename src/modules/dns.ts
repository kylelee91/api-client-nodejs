import * as JsonApi from "../jsonapi/index";
import * as ApiRequest from "../common/request";
import { Id, State, Events, Task, FormattedDoc } from "../common/structures";

export function zones(): typeof DnsZoneRequest;
export function zones(id: string): DnsZoneRequest;
export function zones(id?: string): typeof DnsZoneRequest | DnsZoneRequest {
    if (id) {
        return new DnsZoneRequest(id);
    }

    return DnsZoneRequest;
}

export function domains() {
    return {
        get: async (query?: ApiRequest.QueryParams): Promise<RecordCollection> => {
            return ApiRequest._get<RecordCollection>("dns/domains", query);
        }
    };
}

export interface DnsZoneCollection extends JsonApi.CollectionDocument {
    data: DnsZoneResource[];
}

export interface DnsZone extends JsonApi.ResourceDocument {
    data: DnsZoneResource | null;
}

export interface RecordCollection extends JsonApi.CollectionDocument {
    data: DnsZoneRecordResource[];
}

export interface Record extends JsonApi.ResourceDocument {
    data: DnsZoneRecordResource | null;
}

export type DnsZoneState =
    "pending" |
    "live" |
    "syncing" |
    "deleting" |
    "deleted";

export interface DnsZoneResource {
    id: Id;
    type: "zones";
    attributes: {
        origin: string;
        verified: boolean;
        records: DnsZoneRecordResource[];
        state: State<DnsZoneState>;
        events: Events & {
            last_verification: string;
            verified: string;
        };
    };
}

export type DnsZoneRecordType = "a" | "aaaa" | "cname" | "mx" | "srv" | "ns" | "txt";
export interface DnsZoneRecordResource {
    id: Id;
    type: "records";
    attributes: {
        type: DnsZoneRecordType;
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

export interface NewDnsZoneParams {
    origin: string;
}

export interface NewZoneRecordParams {
    type: DnsZoneRecordType;
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

export interface UpdateDnsZoneParams {
    origin: string;
    records?: UpdateRecordParams[];
}

export interface UpdateRecordParams {
    id: Id;
    type?: DnsZoneRecordType;
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

export type ZoneActions = "verify";
export class DnsZoneRequest {
    private static target = "dns/zones";
    private target: string;

    public static async get(query?: ApiRequest.QueryParams): Promise<DnsZoneCollection> {
        return ApiRequest._get<DnsZoneCollection>(this.target, query);
    }

    public static async create(doc: NewDnsZoneParams, query?: ApiRequest.QueryParams): Promise<DnsZone> {
        return ApiRequest._post<DnsZone>(
            this.target,
            new FormattedDoc({ type: "zones", attributes: doc }),
            query
        );
    }

    constructor(private id: string) {
        this.target = `${DnsZoneRequest.target}/${id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<DnsZone> {
        return ApiRequest._get<DnsZone>(this.target, query);
    }

    public async update(doc: UpdateDnsZoneParams, query?: ApiRequest.QueryParams): Promise<DnsZone> {
        return ApiRequest._patch<DnsZone>(this.target, new FormattedDoc({id: this.id, type: "zones", attributes: doc }), query);
    }

    public async verify(): Promise<Task<"verify">> {
        return this.tasks().create("verify");
    }

    public tasks() {
        return {
            create: async (action: ZoneActions, contents?: Object, query?: ApiRequest.QueryParams): Promise<Task<ZoneActions>> => {
                return ApiRequest._post<Task<ZoneActions>>(
                    `${this.target}/tasks`,
                    new Task<ZoneActions>(action, contents),
                    query
                );
            }
        };
    }

    public async delete() {
        return ApiRequest._delete(this.target);
    }

    public records(): DnsZoneRecordsRequest;
    public records(id: string): DnsZoneRecordRequest;
    public records(id?: string): DnsZoneRecordsRequest | DnsZoneRecordRequest {
        if (id) {
            return new DnsZoneRecordRequest(this.id, id);
        }

        return new DnsZoneRecordsRequest(this.id);
    }
}

export class DnsZoneRecordsRequest {
    private target: string;

    constructor(zoneId: string) {
        this.target = `dns/zones/${zoneId}/records`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<RecordCollection> {
        return ApiRequest._get<RecordCollection>(this.target, query);
    }

    public async create(doc: NewZoneRecordParams, query?: ApiRequest.QueryParams): Promise<Record> {
        return ApiRequest._post<Record>(this.target, new FormattedDoc({ type: "records", attributes: doc }), query);
    }
}

export class DnsZoneRecordRequest {
    private target: string;

    constructor(zoneId: string, private recordId: string) {
        this.target = `dns/zones/${zoneId}/records/${recordId}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Record> {
        return ApiRequest._get<Record>(this.target, query);
    }

    public async update(doc: UpdateRecordParams, query?: ApiRequest.QueryParams): Promise<Record> {
        return ApiRequest._patch<Record>(this.target, new FormattedDoc({id: this.recordId, type: "records", attributes: doc }), query);
    }

    public async delete() {
        return ApiRequest._delete(this.target);
    }
}
