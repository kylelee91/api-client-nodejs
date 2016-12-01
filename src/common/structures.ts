export type ResourceId = string;
export type Time = string;

/**
 * Common fields that can be in any response
 */
export interface TopLevel {
    meta?: Meta;
    includes?: Includes;
}

export interface CollectionDoc extends TopLevel {
    data: Resource[];
}

export interface SingleDoc extends TopLevel {
    data: Resource | null;
}

export interface Resource {
    id: ResourceId;
    meta?: Meta;
}

export interface Meta {
    [key: string]: any;
}

/**
 * includes: {
 *  environments: {
 *      5cdfwe8h3oih: Environment,
 *      5cdfwe8h3oih: Environment
 *  }
 * }
 */
export interface Includes {
    [key: string]: { [key: string]: Resource };
}

export interface QueryParams {
    include?: string[];
    meta?: string[];
    sort?: string[];
    limit?: number;
    filter?: { [key: string]: string };
    page?: {
        number: number;
        size: number;
    };
    // Override team from settings
    team?: ResourceId;
}

export interface Events {
    created?: string;

    updated?: string;

    deleted?: string;

    errored?: string;

    error: {
        message: string;
    };

    started?: string;

    completed?: string;
}

export class NewTask<T extends string> {
    public id?: ResourceId;
    public action: T;
    public contents?: Object;
    public job?: string;

    constructor(action: T, contents?: Object) {
        this.action = action;
        this.contents = contents;
    }
}

export interface Task<T extends string> {
    data: {
        id?: ResourceId;
        action: T;
        contents?: Object;
        job?: string;
    };
}

// T is string literal of allowed states
export interface State<T extends string> {
    changed: Time;

    current: T;

    job: {
        id: ResourceId;
        queue: Time;
        queued: Time;
    };

    error?: {
        block: boolean;
        time?: string;
        message: string;
    };
}

export type ScopeType = "account" | "employee" | "team";
export interface Scope {
    type: ScopeType;
    id: ResourceId;
}
