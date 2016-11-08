// tslint:disable-next-line
import { CycleErrorDetail, ResultFail, ResultSuccess } from "../../common/api";
import * as JsonApi from "../../jsonapi/index";
import * as API from "../../common/api";
import { Id, State, Events, FormattedDoc, Task } from "../../common/structures";

export function document(): typeof CollectionRequest;
export function document(id: Id): SingleRequest;
export function document(id?: Id): typeof CollectionRequest | SingleRequest {
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
    last_4: string;
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

    public static async get(query?: API.QueryParams) {
        return API.get<Collection>(this.target, query);
    }

    // Methods if no ID
    public static async create(method: NewParams, query?: API.QueryParams) {
        return API.post<Single>(
            this.target,
            new FormattedDoc({ type: "billing_methods", attributes: method }),
            query
        );
    }
}

export class SingleRequest {
    private target = "billing/methods";

    constructor(private id: Id) {
        this.target = `${this.target}/${id}`;
    }

    public async update(doc: UpdateParams, query?: API.QueryParams) {
        return API.patch<Single>(
            this.target,
            new FormattedDoc({ id: this.id, type: "billing_methods", attributes: doc }),
            query
        );
    }

    public makePrimary() {
        return this.task("make_primary");
    }

    public task(action: SingleActions, contents?: Object, query?: API.QueryParams) {
        return API.post<Task<SingleActions>>(
            `${this.target}/tasks`,
            new Task(action, contents),
            query
        );
    }

    public async delete() {
        return API.del<Task<"delete">>(this.target);
    }

    public async get(query?: API.QueryParams) {
        return API.get<Single>(this.target, query);
    }
}
