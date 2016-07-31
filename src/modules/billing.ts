import * as JsonApi from "../jsonapi/index";
import * as ApiRequest from "../common/request";
import { Id, State, Events, Task, Time, FormattedDoc } from "../common/structures";
import { TierSummary } from "./tiers";
import { ContainerState } from "./containers";
import { InstanceState } from "./instances";

export function methods(): typeof MethodsRequest;
export function methods(id: string): MethodsRequest;
export function methods(id?: string): typeof MethodsRequest | MethodsRequest {
    if (id) {
        return new MethodsRequest(id);
    }

    return MethodsRequest;
}

export function invoices(): typeof InvoicesRequest;
export function invoices(id: string): InvoicesRequest;
export function invoices(id?: string): typeof InvoicesRequest | InvoicesRequest {
    if (id) {
        return new InvoicesRequest(id);
    }

    return InvoicesRequest;
}

export function services() {
    return new ActiveServicesRequest();
}

// Methods
export interface PaymentMethodCollection extends JsonApi.CollectionDocument {
    data: PaymentMethodResource[];
}

export interface PaymentMethod extends JsonApi.ResourceDocument {
    data: PaymentMethodResource | null;
}

export interface PaymentMethodResource {
    id: Id;
    type: "billing_methods";
    attributes: {
        name: string;
        primary: boolean;
        address: BillingAddress;
        credit_card: CreditCard;
        state: State<"active" | "inactive" | "processing" | "deleting" | "deleted">;
        events: Events;
    };
}


export interface BillingAddress {
    city: string;
    country: string;
    state: string;
    zip: string;
    lines: string[];
}

export interface CreditCard {
    name: string;
    brand: string;
    expiration: {
        month: number;
        year: number
    };
}

export interface NewCreditCardParams {
    name: string;
    number: string;
    cvv2: string;
    expiration: {
        month: number;
        year: number
    };
}

export interface BillingProfile {
    term: string;
    tier: string;
    restrictions: {
        containers: number;
        teams: number;
    };
}

// Invoices
export type BillingCategory = 
    "tier" |
    "infrastructure" |
    "overages" |
    "overages_bandwidth" |
    "overages_image_storage" |
    "support" |
    "other";

export type InvoiceState = 
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

export interface InvoiceCollection extends JsonApi.CollectionDocument {
    data: InvoiceResource[];
}

export interface Invoice extends JsonApi.ResourceDocument {
    data: InvoiceResource | null;
}

export interface Term {
    start: Time;
    end: Time;
}

export interface InvoiceResource {
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
        state: State<InvoiceState>;
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
    category: BillingCategory;
    description: string;
    tier?: TierSummary & { due: number };
    container?: ContainerLineItem;
    quantity: number;
    due: number;
    discount: number;
}

export interface ContainerLineItem {
    id: Id;
    name: string;
    environment: string;
    state: ContainerState;
    due: number;
    instances: InstanceLineItem[];
}

export interface InstanceLineItem {
    id: Id;
    hostname: string;
    usage: InstanceUsage[];
    state: InstanceState;
    due: number;
}

export interface InstanceUsage {
    term: Term;
    state: string;
    due: number;
    hours: number;
}

// Active Services
export interface ActiveServices extends JsonApi.ResourceDocument {
    data: ActiveServicesResource | null;
}

export interface ActiveServicesResource {
    id: Id;
    type: "active_services";
    attributes: {
        term: Term;
        containers: ContainerLineItem[];
        due: number;
        tier: TierSummary & {due: number};
    };
}

export interface NewPaymentMethodParams {
    name: string;
    credit_card: NewCreditCardParams;
    address: BillingAddress;
    team?: string;
}

export interface UpdatePaymentMethodParams {
    name: string;
}

type MethodActions = "make_primary";
export class MethodsRequest {
    private static target = "billing/methods";
    private target: string;

    public static async get(query?: ApiRequest.QueryParams): Promise<PaymentMethodCollection> {
        return ApiRequest._get<PaymentMethodCollection>(this.target, query);
    }

    // Methods if no ID
    public static async create(method: NewPaymentMethodParams, query?: ApiRequest.QueryParams): Promise<PaymentMethod> {
        return ApiRequest._post<PaymentMethod>(
            this.target,
            new FormattedDoc({ type: "billing_methods", attributes: method }),
            query
        );
    }

    // Methods if ID
    constructor(private id: string) {
        this.target = `${MethodsRequest.target}/${id}`;
    }

    public async update(doc: UpdatePaymentMethodParams, query?: ApiRequest.QueryParams): Promise<PaymentMethod> {
        return ApiRequest._patch<PaymentMethod>(
            this.target,
            new FormattedDoc({ id: this.id, type: "billing_methods", attributes: doc}),
            query
        );
    }

    public makePrimary() {
        return this.tasks().create("make_primary");
    }

    public tasks() {
        return {
            create: async (action: MethodActions, contents?: Object, query?: ApiRequest.QueryParams): Promise<Task<MethodActions>> => {
                return ApiRequest._post<Task<MethodActions>>(
                    `${this.target}/tasks`,
                    new Task(action, contents),
                    query
                );
            }
        };
    }

    public async delete(): Promise<Task<"delete">> {
        return ApiRequest._delete<Task<"delete">>(this.target);
    }

    public async get(query?: ApiRequest.QueryParams): Promise<PaymentMethod> {
        return ApiRequest._get<PaymentMethod>(this.target, query);
    }
}

type InvoiceActions = "pay";
export class InvoicesRequest {
    private static target = "billing/invoices";
    private target: string;

    public static async get(query?: ApiRequest.QueryParams): Promise<InvoiceCollection> {
        return ApiRequest._get<InvoiceCollection>(this.target, query);
    }

    // Methods if ID
    constructor(private id: string) {
        this.target = `${InvoicesRequest.target}/${id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Invoice> {
        return ApiRequest._get<Invoice>(this.target, query);
    }

    public async pay() {
        return this.tasks().create("pay");
    }

    public tasks() {
        return {
            create: async (action: InvoiceActions, contents?: Object, query?: ApiRequest.QueryParams): Promise<Task<InvoiceActions>> => {
                return ApiRequest._post<Task<InvoiceActions>>(
                    `${this.target}/tasks`,
                    new Task<InvoiceActions>(action, contents),
                    query
                );
            }
        };
    }
}


export class ActiveServicesRequest {
    private target: string;

    constructor() {
        this.target = `billing/current`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<ActiveServices> {
        return ApiRequest._get<ActiveServices>(this.target, query);
    }
}
