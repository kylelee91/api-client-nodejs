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
    readonly data: Resource[];
}

export interface SingleDoc extends TopLevel {
    readonly data: Resource | null;
}

export interface Resource {
    readonly id: ResourceId;
    readonly meta?: Meta;
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
    extra?: string[];
    sort?: string[];
    limit?: number;
    embed?: string[];
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

export class Task<T extends string> {
    public data: {
        id?: ResourceId;
        action: T;
        contents?: Object
        job?: string;
    };

    constructor(action: T, contents?: Object) {
        this.data = {
            action: action,
            contents: contents
        };
    }
}

// T is string literal of allowed states
export interface State<T extends string> {
    changed: string;

    current: T;

    job: ResourceId;

    error?: {
        block?: boolean;
        time?: string;
        message: string;
    };
}

export type ScopeType = "account" | "employee" | "team";
export interface Scope {
    type: ScopeType;
    id: ResourceId;
}
