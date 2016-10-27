// tslint:disable-next-line
import { CycleErrorDetail, ResultFail, ResultSuccess } from "../../common/api";
import * as JsonApi from "../../jsonapi/index";
import * as API from "../../common/api";
import * as Logins from "./logins";
import * as Billing from "../billing/index";
import { Id, State, Events, Task, Time } from "../../common/structures";

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
        teams: { id: Id; role: number; joined: Time }[];
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

    public static async get(query?: API.QueryParams) {
        return API.get<Single>(this.target);
    }

    public static async update(doc: UpdateParams, query?: API.QueryParams) {

        return API.patch<Single>(this.target, new AccountUpdate(doc), query);
    }

    public static async logins(query?: API.QueryParams) {
        return API.get<Logins.Collection>("account/logins", query);
    }

    public static async lookup(query: API.QueryParams) {
        return API.get<Collection>("account/lookup", query);
    }

    public static async changePassword(doc: ChangePasswordParams, query?: API.QueryParams) {
        return API.patch<Single>("account/password", new AccountUpdate(doc), query);
    }

    public static async changeTier(tier: string) {
        return this.task("apply", { tier: tier });
    }

    public static async task(action: AccountActions, contents?: Object, query?: API.QueryParams) {
        return API.post<Task<AccountActions>>(
            `${this.target}/tasks`,
            new Task<AccountActions>(action, contents),
            query
        );
    }
}

class AccountUpdate {
    data = {
        type: "account",
        attributes: this.doc
    };

    constructor(private doc: UpdateParams | ChangePasswordParams) { }
};
