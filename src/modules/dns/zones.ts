import * as JsonApi from "../../jsonapi/index";
import * as ApiRequest from "../../common/request";
import * as Records from "./records";
import { Id, State, Events, Task, FormattedDoc } from "../../common/structures";

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
    data: Resource | null;
}

export interface Resource {
    id: Id;
    type: "zones";
    attributes: {
        origin: string;
        verified: boolean;
        records: Records.Resource[];
        state: State<States>;
        events: Events & {
            last_verification: string;
            verified: string;
        };
    };
}

export type States = "pending" | "live" | "syncing" | "deleting" | "deleted";

export type SingleActions = "verify";

export interface NewParams {
    origin: string;
}

export interface UpdateParams {
    origin: string;
    records?: Records.UpdateParams[];
}

export class CollectionRequest {
    private static target = "dns/zones";

    public static async get(query?: ApiRequest.QueryParams): Promise<Collection> {
        return ApiRequest._get<Collection>(this.target, query);
    }

    public static async create(doc: NewParams, query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._post<Single>(
            this.target,
            new FormattedDoc({ type: "zones", attributes: doc }),
            query
        );
    }
}

export class SingleRequest {
    private target: string = "dns/zones";

    constructor(private id: string) {
        this.target = `${this.target}/${id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._patch<Single>(
            this.target, 
            new FormattedDoc({ id: this.id, type: "zones", attributes: doc }), 
            query
        );
    }

    public async verify(): Promise<Task<"verify">> {
        return this.tasks().create("verify");
    }

    public tasks() {
        return {
            create: async (action: SingleActions, contents?: Object, query?: ApiRequest.QueryParams): Promise<Task<SingleActions>> => {
                return ApiRequest._post<Task<SingleActions>>(
                    `${this.target}/tasks`,
                    new Task<SingleActions>(action, contents),
                    query
                );
            }
        };
    }

    public async delete() {
        return ApiRequest._delete(this.target);
    }

    public records(): Records.CollectionRequest;
    public records(id: string): Records.SingleRequest;
    public records(id?: string): Records.CollectionRequest | Records.SingleRequest {
        if (id) {
            return new Records.SingleRequest(this.id, id);
        }

        return new Records.CollectionRequest(this.id);
    }
}
