import * as API from "../../common/api";
import * as Logins from "./logins";
import * as Billing from "../../modules/billing/index";
import { 
    CollectionDoc, 
    SingleDoc, 
    Resource, 
    ResourceId, 
    Time, 
    State, 
    NewTask,
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
        added: Time;
    };
    username: string;
    teams: { id: ResourceId; role: number; joined: Time }[];
    state: State<"new"|"live"|"suspending"|"suspended"|"purging"|"deleting"|"deleted">;
    events: Events & {
        suspension: SuspensionEvent;
        last_login: Time;
    };
    billing: Billing.Profile;
    meta?: {
        role: string;
    };
}

export interface SuspensionEvent {
    time: Time;
    reason: string;
    grace_period: Time;
    purged: Time;
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
            new NewTask<AccountActions>(action, contents),
            query
        );
    }
}
