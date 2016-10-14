// tslint:disable-next-line
import { CycleErrorDetail, ResultFail, ResultSuccess } from "../../common/api";
import * as JsonApi from "../../jsonapi/index";
import * as API from "../../common/api";
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

    public static async get(query?: API.QueryParams) {
        return API.get<Collection>(this.target, query);
    }

    public static async create(doc: NewParams, query?: API.QueryParams) {
        return API.post<Single>(
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

    public async get(query?: API.QueryParams) {
        return API.get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: API.QueryParams) {
        return API.patch<Single>(
            this.target,
            new FormattedDoc({ id: this.id, type: "zones", attributes: doc }),
            query
        );
    }

    public async verify() {
        return this.task("verify");
    }

    public async task(action: SingleActions, contents?: Object, query?: API.QueryParams) {
        return API.post<Task<SingleActions>>(
            `${this.target}/tasks`,
            new Task<SingleActions>(action, contents),
            query
        );
    }

    public async delete() {
        return API.del<Task<SingleActions>>(this.target);
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
