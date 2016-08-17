import * as JsonApi from "../../jsonapi/index";
import * as ApiRequest from "../../common/request";
import { Id, State, Events, FormattedDoc, Task } from "../../common/structures";

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
    type: "billing_methods";
    attributes: {
        name: string;
        primary: boolean;
        address: BillingAddress;
        credit_card: CreditCard;
        state: State<States>;
        events: Events;
    };
}

export type States = "active" | "inactive" | "processing" | "deleting" | "deleted";

export type SingleActions = "make_primary";

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

export interface CreditCardParams {
    name: string;
    number: string;
    cvv2: string;
    expiration: {
        month: number;
        year: number
    };
}

export interface NewParams {
    name: string;
    credit_card: CreditCardParams;
    address: BillingAddress;
    team?: string;
}

export interface UpdateParams {
    name: string;
}

export class CollectionRequest {
    private static target = "billing/methods";

    public static async get(query?: ApiRequest.QueryParams): Promise<Collection> {
        return ApiRequest._get<Collection>(this.target, query);
    }

    // Methods if no ID
    public static async create(method: NewParams, query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._post<Single>(
            this.target,
            new FormattedDoc({ type: "billing_methods", attributes: method }),
            query
        );
    }
}

export class SingleRequest {
    private target = "billing/methods";

    constructor(private id: string) {
        this.target = `${this.target}/${id}`;
    }

    public async update(doc: UpdateParams, query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._patch<Single>(
            this.target,
            new FormattedDoc({ id: this.id, type: "billing_methods", attributes: doc }),
            query
        );
    }

    public makePrimary() {
        return this.tasks().create("make_primary");
    }

    public tasks() {
        return {
            create: async (action: SingleActions, contents?: Object, query?: ApiRequest.QueryParams): Promise<Task<SingleActions>> => {
                return ApiRequest._post<Task<SingleActions>>(
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

    public async get(query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._get<Single>(this.target, query);
    }
}
