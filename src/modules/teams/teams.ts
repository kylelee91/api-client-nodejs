// tslint:disable-next-line
import { CycleErrorDetail, ResultFail, ResultSuccess } from "../../common/api";
import * as JsonApi from "../../jsonapi/index";
import * as API from "../../common/api";
import * as Billing from "../billing/index";
import * as Accounts from "../accounts/index";
import * as Invites from "./invites";
import { Id, State, Events, Task, FormattedDoc } from "../../common/structures";

export function document(): typeof CollectionRequest;
export function document(id: string): SingleRequest;
export function document(id?: string): typeof CollectionRequest | SingleRequest {
    if (!id) {
        return CollectionRequest;
    }

    return new SingleRequest(id);
}

export interface Collection extends JsonApi.CollectionDocument {
    data: Resource[];
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Resource extends JsonApi.Resource {
    id: Id;
    type: "teams";
    attributes: {
        name: string;
        about: {
            description: string;
        };

        state: State<States>;
        events: Events;
        billing: Billing.Profile;
    };

    relationships?: {
        owner: JsonApi.ToOneRelationship;
    };
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

    public static async get(query?: API.QueryParams) {
        return API.get<Collection>(this.target, query);
    }

    public static async create(doc: NewParams, query?: API.QueryParams) {
        return API.post<Single>(this.target, new FormattedDoc({ type: "teams", attributes: doc }), query);
    }

    public static invitations(): Invites.CollectionRequest;
    public static invitations(id: string): Invites.SingleRequest;
    public static invitations(id?: string): Invites.CollectionRequest | Invites.SingleRequest {
        if (id) {
            return new Invites.SingleRequest(undefined, id);
        }

        return new Invites.CollectionRequest();
    }
}

export class SingleRequest {
    private target: string;

    constructor(private id: string) {
        this.target = `teams/${id}`;
    }

    public async get(query?: API.QueryParams) {
        return API.get<Single>(this.target, query);
    }

    public async update(doc: UpdateParams, query?: API.QueryParams) {
        return API.patch<Single>(this.target, new FormattedDoc({ type: "teams", attributes: doc }), query);
    }

    public async delete(query?: API.QueryParams) {
        return API.del<Single>(this.target, query);
    }

    public async changeTier(tier: string) {
        return this.task("change_tier", { tier: tier });
    }

    public async task(action: SingleActions, contents?: Object, query?: API.QueryParams) {
        return API.post<Task<SingleActions>>(
            `${this.target}/tasks`,
            new Task<SingleActions>(action, contents),
            query
        );
    }

    public members(): MembersRequest;
    public members(id: string): MemberRequest;
    public members(id?: string): MembersRequest | MemberRequest {
        if (!id) {
            return new MembersRequest(this.id);
        }

        return new MemberRequest(this.id, id);
    }

    public invitations(): Invites.CollectionRequest;
    public invitations(id: string): Invites.SingleRequest;
    public invitations(id?: string): any {
        if (id) {
            return new Invites.SingleRequest(this.id, id);
        }

        return new Invites.CollectionRequest(this.id);
    }
}

export class MembersRequest {
    private target: string;

    constructor(team_id: string) {
        this.target = `teams/${team_id}/members`;
    }

    public async get(query?: API.QueryParams): Promise<ResultSuccess<Accounts.Collection> | ResultFail<CycleErrorDetail>> {
        return API.get<Accounts.Collection>(this.target, query);
    }
}

export class MemberRequest {
    private target: string;

    constructor(team_id: string, member_id: string) {
        this.target = `teams/${team_id}/members/${member_id}`;
    }

    public async delete(query?: API.QueryParams) {
        return API.del<Task<SingleActions>>(this.target, query);
    }
}
