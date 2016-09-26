import * as JsonApi from "../../jsonapi/index";
import * as API from "../../common/api";
import * as Tiers from "../tiers/tiers";
import { Term, ContainerLineItem } from "./common";
import { Id, State, Time, Events, Task } from "../../common/structures";

export function document(): typeof CollectionRequest;
export function document(id: string): SingleRequest;
export function document(id?: string): typeof CollectionRequest | SingleRequest {
    if (id) {
        return new SingleRequest(id);
    }

    return CollectionRequest;
}

export interface Collection extends JsonApi.CollectionDocument {
    data: Resource[];
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Resource {
    id: Id;
    type: "invoices";
    attributes: {
        items: LineItem[];
        approved: boolean;
        term: Term;
        charges: number;
        late_fees: LateFee[];
        payments: Payment[];
        credits: Credit[];
        refunds: Refund[];
        state: State<States>;
        events: Events & {
            billed: Time;
            paid: Time;
            due: Time;
            overdue: Time;
            credited: Time;
            voided: Time;
        };
    };

    relationships?: {
        account: JsonApi.ToOneRelationship;
        team: JsonApi.ToOneRelationship;
    };

    meta?: {
        amount_due?: number;
        environments: { [key: string]: { name: string, id: Id } };
    };
}

export type SingleActions = "pay";

export type States =
    "new" |
    "billing" |
    "billed" |
    "processing" |
    "partially-paid" |
    "paid" |
    "refunding" |
    "refunded" |
    "crediting" |
    "credited" |
    "voiding" |
    "voided";

export type Categories =
    "tier" |
    "infrastructure" |
    "overages" |
    "overages_bandwidth" |
    "overages_image_storage" |
    "support" |
    "other";

export interface Payment {
    id: Id;
    time: Time;
    description: string;
    amount: number;
    amount_refunded: number;
    method: string;
    result: {
        success: boolean;
        error: string;
    };
}

export interface Credit {
    id: Id;
    time: Time;
    description: string;
    amount: number;
    account_credit: string;
}

export interface LateFee {
    id: Id;
    time: Time;
    amount: number;
    description: string;
}

export interface Refund {
    id: Id;
    time: Time;
    description: string;
    amount: number;
}

export interface LineItem {
    term: Term;
    category: Categories;
    description: string;
    tier?: Tiers.Summary & { due: number };
    container?: ContainerLineItem;
    quantity: number;
    due: number;
    discount: number;
}


export class CollectionRequest {
    private static target = "billing/invoices";

    public static async get(query?: API.QueryParams): API.Response<Collection> {
        return API.get<Collection>(this.target, query);
    }
}

export class SingleRequest {
    private target: string = "billing/invoices";

    // Methods if ID
    constructor(private id: string) {
        this.target = `${this.target}/${id}`;
    }

    public async get(query?: API.QueryParams): API.Response<Single> {
        return API.get<Single>(this.target, query);
    }

    public async pay(): API.Response<Task<SingleActions>> {
        return this.task("pay");
    }

    public async task(action: SingleActions, contents?: Object, query?: API.QueryParams): API.Response<Task<SingleActions>> {
        return API.post<Task<SingleActions>>(
            `${this.target}/tasks`,
            new Task<SingleActions>(action, contents),
            query
        );
    }
}
