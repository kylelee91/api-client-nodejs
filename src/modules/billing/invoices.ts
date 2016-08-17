import * as JsonApi from "../../jsonapi/index";
import * as ApiRequest from "../../common/request";
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

    public static async get(query?: ApiRequest.QueryParams): Promise<Collection> {
        return ApiRequest._get<Collection>(this.target, query);
    }
}

export class SingleRequest {
    private target: string = "billing/invoices";

    // Methods if ID
    constructor(private id: string) {
        this.target = `${this.target}/${id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._get<Single>(this.target, query);
    }

    public async pay() {
        return this.tasks().create("pay");
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
}
