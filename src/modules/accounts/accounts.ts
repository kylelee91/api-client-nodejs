import * as JsonApi from "../../jsonapi/index";
import * as ApiRequest from "../../common/request";
import * as Logins from "./logins";
import * as Billing from "../billing/index";
import { Id, State, Events, Task } from "../../common/structures";

export function document(): typeof AccountRequest {
    return AccountRequest;
}

export interface Collection extends JsonApi.CollectionDocument {
    data: Resource[];
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Resource extends JsonApi.Resource {
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
        billing: Billing.Profile;
    };

    meta?: {
        role: string;
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

    public static async get(query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._get<Single>(this.target);
    }

    public static async update(doc: UpdateParams, query?: ApiRequest.QueryParams): Promise<Single> {

        return ApiRequest._patch<Single>(this.target, new AccountUpdate(doc), query);
    }

    public static async logins(query?: ApiRequest.QueryParams): Promise<Logins.Collection> {
        return ApiRequest._get<Logins.Collection>("account/logins", query);
    }

    public static async lookup(query?: ApiRequest.QueryParams): Promise<Collection> {
        return ApiRequest._get<Collection>("account/lookup", query);
    }

    public static async changePassword(doc: ChangePasswordParams, query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._patch<Single>("account/password", new AccountUpdate(doc), query);
    }

    public static async changeTier(tier: string) {
        return this.tasks().create("apply", { tier: tier });
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

    constructor(private doc: UpdateParams | ChangePasswordParams) { }
};
