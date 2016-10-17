import * as JsonApi from "../../jsonapi/index";
import * as ApiRequest from "../../common/request";
import * as Roles from "./roles";
import { Id, Time, Events, FormattedDoc } from "../../common/structures";

export function document(): CollectionRequest;
export function document(invite: undefined, team: Id): CollectionRequest;
export function document(invite: Id): SingleRequest;
export function document(invite?: Id, team?: Id): CollectionRequest | SingleRequest {
    if (!invite) {
        return new CollectionRequest(team);
    }

    return new SingleRequest(invite);
}

export interface Collection extends JsonApi.CollectionDocument {
    data: Resource[];
}

export interface Single extends JsonApi.ResourceDocument {
    data: Resource | null;
}

export interface Resource extends JsonApi.Resource {
    id: Id;
    type: "invites";
    attributes: {
        events: Events
        accepted: Time;
        declined: Time;
        revoked: Time;
        role: Roles.Names;
    };
    relationships?: {
        team: JsonApi.ToOneRelationship;
        inviter: JsonApi.ToOneRelationship;
        invitee: JsonApi.ToOneRelationship;
    };
}

export interface NewParams {
    invitee: Id;
    role: Roles.Names;
}

export class CollectionRequest {
    private target: string;

    constructor(teamId?: string) {
        if (teamId) {
            this.target = `teams/${teamId}/invites`;
        } else {
            this.target = `teams/invites`;
        }
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Collection> {
        return ApiRequest._get<Collection>(this.target, query);
    }

    public async create(doc: NewParams, query?: ApiRequest.QueryParams): Promise<Single> {
        const relationship = {data: { type: "accounts", id: doc.invitee }};
        return ApiRequest._post<Single>(
            this.target,
            new FormattedDoc({ type: "invitations", relationships: { invitee: relationship }, attributes: { role: doc.role } }),
            query
        );
    }
}

export class SingleRequest {
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

    public async get(query?: ApiRequest.QueryParams): Promise<Single> {
        return ApiRequest._get<Single>(this.target, query);
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

        return ApiRequest._post<Single>(this.target, new InviteAction(), query);
    }
}
