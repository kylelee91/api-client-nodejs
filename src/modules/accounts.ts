import * as JsonApi from "../jsonapi/index";
import * as ApiRequest from "../common/request";
import { BillingProfile } from "./billing";
import { Id, State, Events, Task } from "../common/structures";

export function document(): typeof AccountRequest {
    return AccountRequest;
}

export interface AccountCollection extends JsonApi.CollectionDocument {
    data: AccountResource[];
}

export interface Account extends JsonApi.ResourceDocument {
    data: AccountResource | null;
}

export interface AccountResource extends JsonApi.Resource {
    id: Id;
    type: "accounts";
    attributes: {
        name: {
            first: string;
            last: string;
        };
        auth: {
            allow_employee_login: boolean;
        };
        email: {
            address: string;
            verified: boolean;
            added: string // Time
        };
        username: string;
        teams: { id: string; role: number; joined: string }[];
        state: State<"">;
        events: Events;
        billing: BillingProfile;
    };

    meta?: {
        role: string;
    };
}

export interface LoginCollection extends JsonApi.CollectionDocument {
    data: LoginResource[];
}

export interface Login extends JsonApi.ResourceDocument {
    data: LoginResource | null;
}

export interface LoginResource {
    id: Id;
    type: string;
    attributes: {
        account: string;
        time: string;
        success: string;
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

type AccountActions = "change_tier";
export class AccountRequest {
    private static target: string = "account";

    public static async get(query?: ApiRequest.QueryParams): Promise<Account> {
        return ApiRequest._get<Account>(this.target);
    }

    public static async update(doc: UpdateParams, query?: ApiRequest.QueryParams): Promise<Account> {

        return ApiRequest._patch<Account>(this.target, new AccountUpdate(doc), query);
    }

    public static async logins(query?: ApiRequest.QueryParams): Promise<LoginCollection> {
        return ApiRequest._get<LoginCollection>("account/logins", query);
    }

    public static async lookup(query?: ApiRequest.QueryParams): Promise<AccountCollection> {
        return ApiRequest._get<AccountCollection>("account/lookup", query);
    }

    public static async changePassword(doc: ChangePasswordParams, query?: ApiRequest.QueryParams): Promise<Account> {
        return ApiRequest._patch<Account>("account/password", new AccountUpdate(doc), query);
    }

    public static async changeTier(tier: string) {
        return this.tasks().create("change_tier", { tier: tier });
    }

    public static tasks() {
        return {
            create: async (action: AccountActions, contents?: Object, query?: ApiRequest.QueryParams): Promise<Task<AccountActions>> => {
                return ApiRequest._post<Task<AccountActions>>(
                    `${this.target}/tasks`,
                    new Task<AccountActions>(action, contents),
                    query
                );
            }
        };
    }
}

class AccountUpdate {
    data = {
        type: "account",
        attributes: this.doc
    };

    constructor(private doc: UpdateParams | ChangePasswordParams) {}
};
