import * as API from "../../common/api";
import * as Roles from "./roles";
import {
    CollectionDoc,
    SingleDoc,
    ResourceId,
    Resource,
    QueryParams,
    Events,
    Time
} from "../../common/structures";

export function document(): CollectionRequest;
export function document(invite: undefined, team: ResourceId): CollectionRequest;
export function document(invite: ResourceId): SingleRequest;
export function document(invite?: ResourceId, team?: ResourceId): CollectionRequest | SingleRequest {
    if (!invite) {
        return new CollectionRequest(team);
    }

    return new SingleRequest(invite);
}

export interface Collection extends CollectionDoc {
    data: Invite[];
}

export interface Single extends SingleDoc {
    data: Invite | null;
}

export interface Invite extends Resource {
    team: ResourceId;
    inviter: ResourceId;
    invitee: ResourceId;
    events: Events;
    accepted: Time;
    declined: Time;
    revoked: Time;
    role: Roles.Names;
}

export interface NewParams {
    invitee: ResourceId;
    role: Roles.Names;
}

export class CollectionRequest {
    private target: string;

    constructor(teamId?: ResourceId) {
        if (teamId) {
            this.target = `teams/${teamId}/invites`;
        } else {
            this.target = `teams/invites`;
        }
    }

    public async get(query?: QueryParams) {
        return API.get<Collection>(this.target, query);
    }

    public async create(doc: NewParams, query?: QueryParams) {
        return API.post<Single>(this.target, doc, query);
    }
}

export class SingleRequest {
    private target: string;

    constructor(team_id?: ResourceId, private invite_id?: ResourceId) {
        if (team_id) {
            this.target = `teams/${team_id}/invites`;
        } else {
            this.target = `teams/invites`;
        }

        if (invite_id) {
            this.target += "/" + invite_id;
        }
    }

    public async get(query?: QueryParams) {
        return API.get<Single>(this.target, query);
    }

    public async accept(query?: QueryParams) {
        return this.action("accept", query);
    }

    public async decline(query?: QueryParams) {
        return this.action("decline", query);
    }

    public action(action: "accept" | "decline", query?: QueryParams) {
        this.target += "/actions";
        return API.post<Single>(this.target, {data: {accept: action === "accept"}}, query);
    }
}
