import * as API from "../../common/api";
import * as Billing from "../billing/index";
import * as Accounts from "../accounts/index";
import * as Invites from "./invites";
import {
    CollectionDoc,
    SingleDoc,
    Resource,
    ResourceId,
    QueryParams,
    State,
    Events,
    NewTask
} from "../../common/structures";

export function document(): typeof CollectionRequest;
export function document(id: ResourceId): SingleRequest;
export function document(id?: ResourceId): typeof CollectionRequest | SingleRequest {
    if (!id) {
        return CollectionRequest;
    }

    return new SingleRequest(id);
}

export interface Collection extends CollectionDoc {
    data: Team[];
}

export interface Single extends SingleDoc {
    data: Team | null;
}

export interface Team extends Resource {
    name: string;
    about: {
        description: string;
    };
    state: State<States>;
    events: Events;
    billing: Billing.Profile;
    owner: ResourceId;
}

export type States = "live" | "deleting" | "deleted";

export interface NewParams {
    name: string;
    about?: {
        description?: string;
        website?: string;
    };
}

export interface UpdateParams {
    name?: string;
    about?: {
        description?: string;
        website?: string;
    };
}

export type SingleActions = "change_tier";

export class CollectionRequest {
    private static target = "teams";

    public static async get(query?: QueryParams) {
        return API.get<Collection>(this.target, query);
    }

    public static async create(doc: NewParams, query?: QueryParams) {
        return API.post<Single>(this.target, doc, query);
    }

    public static invitations(): Invites.CollectionRequest;
    public static invitations(id: ResourceId): Invites.SingleRequest;
    public static invitations(id?: ResourceId): Invites.CollectionRequest | Invites.SingleRequest {
        if (id) {
            return new Invites.SingleRequest(undefined, id);
        }

        return new Invites.CollectionRequest();
    }
}

export class SingleRequest {
    private target: string;

    constructor(private id: ResourceId) {
        this.target = `teams/${id}`;
    }

    public async get(query?: QueryParams) {
        return API.get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: QueryParams) {
        return API.patch<Single>(this.target, doc, query);
    }

    public async delete(query?: QueryParams) {
        return API.del<Single>(this.target, query);
    }

    public async changeTier(tier: string) {
        return this.task("change_tier", { tier: tier });
    }

    public async task(action: SingleActions, contents?: Object, query?: QueryParams) {
        return API.post<NewTask<SingleActions>>(
            `${this.target}/tasks`,
            new NewTask<SingleActions>(action, contents),
            query
        );
    }

    public members(): MembersRequest;
    public members(id: ResourceId): MemberRequest;
    public members(id?: ResourceId): MembersRequest | MemberRequest {
        if (!id) {
            return new MembersRequest(this.id);
        }

        return new MemberRequest(this.id, id);
    }

    public invitations(): Invites.CollectionRequest;
    public invitations(id: ResourceId): Invites.SingleRequest;
    public invitations(id?: ResourceId): any {
        if (id) {
            return new Invites.SingleRequest(this.id, id);
        }

        return new Invites.CollectionRequest(this.id);
    }
}

export class MembersRequest {
    private target: string;

    constructor(team_id: ResourceId) {
        this.target = `teams/${team_id}/members`;
    }

    public async get(query?: QueryParams): Promise<API.ApiResult<Accounts.Collection>> {
        return API.get<Accounts.Collection>(this.target, query);
    }
}

export class MemberRequest {
    private target: string;

    constructor(team_id: ResourceId, member_id: ResourceId) {
        this.target = `teams/${team_id}/members/${member_id}`;
    }

    public async delete(query?: QueryParams) {
        return API.del<NewTask<SingleActions>>(this.target, query);
    }
}
