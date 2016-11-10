import * as API from "../../common/api";
import { 
    CollectionDoc, 
    SingleDoc, 
    Resource, 
    ResourceId, 
    State, 
    NewTask,
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
    data: Method[];
}

export interface Single extends SingleDoc {
    data: Method | null;
}

export interface Method extends Resource {
    name: string;
    primary: boolean;
    address: BillingAddress;
    credit_card: CreditCard;
    state: State<States>;
    events: Events;
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

    public static async get(query?: QueryParams) {
        return API.get<Collection>(this.target, query);
    }

    // Methods if no ID
    public static async create(method: NewParams, query?: QueryParams) {
        return API.post<Single>(
            this.target,
            method,
            query
        );
    }
}

export class SingleRequest {
    private target: string;

    constructor(private id: ResourceId) {
        this.target = `billing/methods/${id}`;
    }

    public async update(doc: UpdateParams, query?: QueryParams) {
        return API.patch<Single>(
            this.target,
            doc,
            query
        );
    }

    public makePrimary() {
        return this.task("make_primary");
    }

    public task(action: SingleActions, contents?: Object, query?: QueryParams) {
        return API.post<Task<SingleActions>>(
            `${this.target}/tasks`,
            new NewTask(action, contents),
            query
        );
    }

    public async delete() {
        return API.del<Task<"delete">>(this.target);
    }

    public async get(query?: QueryParams) {
        return API.get<Single>(this.target, query);
    }
}
