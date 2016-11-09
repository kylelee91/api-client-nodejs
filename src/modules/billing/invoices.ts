import * as API from "../../common/api";
import * as Tiers from "../tiers/tiers";
import { Term, ContainerLineItem } from "./common";
import  { Environment } from "../environments";
import { 
    CollectionDoc, 
    SingleDoc, 
    Resource, 
    ResourceId, 
    Time, 
    State, 
    Task,
    Events,
    QueryParams
} from "../../common/structures";

export function document(): typeof CollectionRequest;
export function document(id: ResourceId): SingleRequest;
export function document(id?: ResourceId): typeof CollectionRequest | SingleRequest {
    if (id) {
        return new SingleRequest(id);
    }

    return CollectionRequest;
}

export interface Collection extends CollectionDoc {
    data: Invoice[];
}

export interface Single extends SingleDoc {
    data: Invoice | null;
    includes?: {
        environments: {[key: string]: Environment}
    };
}

export interface Invoice extends Resource {
    account: ResourceId;
    team: ResourceId;
    items: InvoiceLineItem[];
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
    "overages" |
    "overages_bandwidth" |
    "overages_image_storage" |
    "support" |
    "other";

export interface Payment {
    id: ResourceId;
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
    id: ResourceId;
    time: Time;
    description: string;
    amount: number;
    account_credit: string;
}

export interface LateFee {
    id: ResourceId;
    time: Time;
    amount: number;
    description: string;
}

export interface Refund {
    id: ResourceId;
    time: Time;
    description: string;
    amount: number;
}

export type InvoiceLineItem = LineItemWithContainer | LineItemWithTier | LineItemOther;

export interface LineItem {
    term: Term;
    description: string;
    quantity: number;
    due: number;
    discount: number;
}

export interface LineItemWithTier extends LineItem {
    category: "tier";
    tier: Tiers.Summary & { due: number };
}

export interface LineItemWithContainer extends LineItem {
    category: "infrastructure";
    container: ContainerLineItem;
}

export interface LineItemOther extends LineItem {
    category: Categories;
    container: ContainerLineItem;
}

export class CollectionRequest {
    private static target = "billing/invoices";

    public static async get(query?: QueryParams) {
        return API.get<Collection>(this.target, query);
    }
}

export class SingleRequest {
    private target: string = "billing/invoices";

    // Methods if ID
    constructor(private id: ResourceId) {
        this.target = `${this.target}/${id}`;
    }

    public async get(query?: QueryParams) {
        return API.get<Single>(this.target, query);
    }

    public async pay() {
        return this.task("pay");
    }

    public async task(action: SingleActions, contents?: Object, query?: QueryParams) {
        return API.post<Task<SingleActions>>(
            `${this.target}/tasks`,
            new Task<SingleActions>(action, contents),
            query
        );
    }
}
