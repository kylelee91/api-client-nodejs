import * as API from "common/api";
import * as Logins from "./logins";
import * as Billing from "modules/billing/index";
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

export function document(): typeof AccountRequest {
    return AccountRequest;
}

export interface Collection extends CollectionDoc {
    data: Account[];
}

export interface Single extends SingleDoc {
    data: Account | null;
}

export interface Account extends Resource {
    id: ResourceId;
    readonly name: {
        readonly first: string;
        readonly last: string;
    };
    readonly auth: {
        readonly allow_employee_login: boolean;
    };
    readonly email: {
        readonly address: string;
        readonly verified: boolean;
        readonly added: string // Time
    };
    readonly username: string;
    readonly teams: { readonly id: ResourceId; readonly role: number; readonly joined: Time }[];
    readonly state: State<"">;
    readonly events: Events;
    readonly billing: Billing.Profile;
    readonly meta?: {
        readonly role: string;
    };
}

export interface UpdateParams {
    name?: {
        first?: string;
        last?: string;
    };

    position?: string;

    auth?: {
        allow_employee_login?: boolean;
    };
}

export interface ChangePasswordParams {
    current: string;
    new: string;
}

export type AccountActions = "apply";
export class AccountRequest {
    private static target: string = "account";

    public static async get(query?: QueryParams) {
        return API.get<Single>(this.target);
    }

    public static async update(doc: UpdateParams, query?: QueryParams) {

        return API.patch<Single>(this.target, doc, query);
    }

    public static async logins(query?: QueryParams) {
        return API.get<Logins.Collection>("account/logins", query);
    }

    public static async lookup(query: QueryParams) {
        return API.get<Collection>("account/lookup", query);
    }

    public static async changePassword(doc: ChangePasswordParams, query?: QueryParams) {
        return API.patch<Single>("account/password", doc, query);
    }

    public static async changeTier(tier: string) {
        return this.task("apply", { tier: tier });
    }

    public static async task(action: AccountActions, contents?: Object, query?: QueryParams) {
        return API.post<Task<AccountActions>>(
            `${this.target}/tasks`,
            new Task<AccountActions>(action, contents),
            query
        );
    }
}
