import * as JsonApi from "../jsonapi/index";
import * as ApiRequest from "../common/request";
import { BillingProfile } from "./billing";
import { AccountCollection } from "./accounts";
import { Id, Time, State, Events, Task, FormattedDoc } from "../common/structures";

export function document(): typeof TeamsRequest;
export function document(id: string): TeamRequest;
export function document(id?: string): typeof TeamsRequest | TeamRequest {
    if (!id) {
        return TeamsRequest;
    }

    return new TeamRequest(id);
}

export interface TeamCollection extends JsonApi.CollectionDocument {
    data: TeamResource[];
}

export interface Team extends JsonApi.ResourceDocument {
    data: TeamResource | null;
}
export interface InviteCollection extends JsonApi.CollectionDocument {
    data: TeamInviteResource[];
}

export interface Invite extends JsonApi.ResourceDocument {
    data: TeamInviteResource | null;
}

export interface RoleCollection extends JsonApi.CollectionDocument {
    data: TeamRoleResource[];
}

export interface Role extends JsonApi.ResourceDocument {
    data: TeamRoleResource | null;
}

export enum RoleType {
    Owner = 1,
    Admin = 2,
    Developer = 4,
    Analyst = 8
}

export interface TeamInviteResource extends JsonApi.Resource {
    id: Id;
    type: "invites";
    attributes: {
        events: Events
        accepted: Time;
        declined: Time;
        revoked: Time;
        role: RoleType;
    };
    relationships?: {
        team: JsonApi.ToOneRelationship;
        inviter: JsonApi.ToOneRelationship;
        invitee: JsonApi.ToOneRelationship;
    };
}

export interface TeamRoleResource extends JsonApi.Resource {
    id: Id;
    type: string;
    attributes: {
        name: string;
    };
}

export type TeamState = "live" | "deleting" | "deleted";
export interface TeamResource extends JsonApi.Resource {
    id: Id;
    type: "teams";
    attributes: {
        name: string;
        about: {
            description: string;
            website: string;
        };

        state: State<TeamState>;
        events: Events;
        billing: BillingProfile;
    };

    relationships?: {
        owner: JsonApi.ToOneRelationship;
    };
}

export interface NewTeamParams {
    name: string;
    about?: {
        description?: string;
        website?: string;
    };
}

export class TeamsRequest {
    private static target = "teams";

    public static async get(query?: ApiRequest.QueryParams): Promise<TeamCollection> {
        return ApiRequest._get<TeamCollection>(this.target, query);
    }

    public static async create(doc: NewTeamParams, query?: ApiRequest.QueryParams): Promise<Team> {
        return ApiRequest._post<Team>(this.target, new FormattedDoc({ type: "teams", attributes: doc }), query);
    }

    public static invitations(): TeamInvitationsRequest;
    public static invitations(id: string): TeamInvitationRequest;
    public static invitations(id?: string): TeamInvitationsRequest | TeamInvitationRequest {
        if (id) {
            return new TeamInvitationRequest(undefined, id);
        }

        return new TeamInvitationsRequest();
    }

    public static roles() {
        return {
            get: async (query?: ApiRequest.QueryParams): Promise<RoleCollection> => {
                return ApiRequest._get<RoleCollection>(this.target + "/roles", query);
            }
        };
    }
}

export interface UpdateTeamParams {
    name?: string;
    about?: {
        description?: string;
        website?: string;
    };
}

export type TeamActions = "change_tier";
export class TeamRequest {
    private target: string;

    constructor(private id: string) {
        this.target = `teams/${id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Team> {
        return ApiRequest._get<Team>(this.target, query);
    }

    public async update(doc: UpdateTeamParams, query?: ApiRequest.QueryParams): Promise<Team> {
        return ApiRequest._patch<Team>(this.target, new FormattedDoc({ type: "teams", attributes: doc }), query);
    }

    public async delete(query?: ApiRequest.QueryParams): Promise<Team> {
        return ApiRequest._delete<Team>(this.target, query);
    }

    public async changeTier(tier: string) {
        return this.tasks().create("change_tier", { tier: tier });
    }

    public tasks() {
        return {
            create: async (action: TeamActions, contents?: Object, query?: ApiRequest.QueryParams): Promise<Task<TeamActions>> => {
                return ApiRequest._post<Task<TeamActions>>(
                    `${this.target}/tasks`,
                    new Task<TeamActions>(action, contents),
                    query
                );
            }
        };
    }

    public members(): MembersRequest;
    public members(id: string): MemberRequest;
    public members(id?: string): MembersRequest | MemberRequest {
        if (!id) {
            return new MembersRequest(this.id);
        }

        return new MemberRequest(this.id, id);
    }

    public invitations(): TeamInvitationsRequest;
    public invitations(id: string): TeamInvitationRequest;
    public invitations(id?: string): any {
        if (id) {
            return new TeamInvitationRequest(this.id, id);
        }

        return new TeamInvitationsRequest(this.id);
    }
}

export class MembersRequest {
    private target: string;

    constructor(team_id: string) {
        this.target = `teams/${team_id}/members`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<AccountCollection> {
        return ApiRequest._get<AccountCollection>(this.target, query);
    }
}

export class MemberRequest {
    private target: string;

    constructor(team_id: string, member_id: string) {
        this.target = `teams/${team_id}/members/${member_id}`;
    }

    public async delete(query?: ApiRequest.QueryParams): Promise<Task<TeamActions>> {
        return ApiRequest._delete<Task<TeamActions>>(this.target, query);
    }
}

export interface NewTeamInviteParams {
    invitee: Id;
}

export class TeamInvitationsRequest {
    private target: string;

    constructor(team_id?: string) {
        if (team_id) {
            this.target = `teams/${team_id}/invites`;
        } else {
            this.target = `teams/invites`;
        }
    }

    public async get(query?: ApiRequest.QueryParams): Promise<InviteCollection> {
        return ApiRequest._get<InviteCollection>(this.target, query);
    }

    public async create(doc: NewTeamInviteParams, query?: ApiRequest.QueryParams): Promise<Invite> {
        const relationship = {invitee: {type: "accounts"}, id: doc.invitee};
        return ApiRequest._post<Invite>(this.target, new FormattedDoc({type: "invites", relationships: {invitee: relationship}}), query);
    }
}

export class TeamInvitationRequest {
    private target: string;

    constructor(team_id?: string, private invite_id?: string) {
        if (team_id) {
            this.target = `teams/${team_id}/invites`;
        } else {
            this.target = `teams/invites`;
        }

        if (invite_id) {
            this.target += "/" + invite_id;
        }
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Invite> {
        return ApiRequest._get<Invite>(this.target, query);
    }

    public async accept(query?: ApiRequest.QueryParams) {
        return this.action("accept", query);
    }

    public async decline(query?: ApiRequest.QueryParams) {
        return this.action("decline", query);
    }

    public action(action: "accept" | "decline", query?: ApiRequest.QueryParams) {
        this.target += "/actions";
        const invite_id = this.invite_id;
        class InviteAction {
            public data = {
                id: invite_id,
                type: "actions",
                attributes: {
                    accept: false,
                    decline: false
                }
            };
            constructor() {
                this.data.attributes.accept = (action === "accept");
                this.data.attributes.decline = (action !== "accept");
            }
        }

        return ApiRequest._post<Invite>(this.target, new InviteAction(), query);
    }
}
