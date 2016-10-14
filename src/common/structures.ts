import * as JsonApi from "../jsonapi/index";
import { ErrorCode } from "./errors";

export type Id = string;

export type ApiResult<T> = ResultSuccess<T> | ResultFail<CycleErrorDetail>;

export interface ResultSuccess<T> {
    ok: true;
    value: T;
}

export interface ResultFail<T> {
    ok: false;
    error: T;
}

export interface CycleErrorDetail extends JsonApi.ErrorDetail {
    code?: ErrorCode;
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

// T is string literal of allowed states
export interface State<T extends string> {
    changed: string;
    
    current: T; 

    job?: {
        id: string;
        block: boolean;
        queued: string; //time
    };

    error?: {
        block?: boolean;
        time?: string;
        message: string;
    };
}

export type ScopeType = "account" | "employee" | "team";
export interface Scope {
    type: ScopeType;
    id: Id;
}

export type Time = string;

export type DocType = "task";
export class Task<T extends string> {
    public data: {
        id?: string;
        type: DocType;
        attributes: {
            action: T;
            contents?: Object
        };

        relationships?: {
            job: JsonApi.ToOneRelationship;
        };
    };
    
    constructor(action: T, contents?: Object) {
        this.data = {
            type: "task",
            attributes: {
                action: action,
                contents: contents
            }
        };
    }
}

export class FormattedDoc implements JsonApi.ResourceDocument {
    data: JsonApi.Resource;

    constructor(options: {type: string, id?: string, attributes?: Object, relationships?: {[key: string]: JsonApi.Relationship}}) {
        this.data = {
            type: options.type,
        };

        if (options.id) {
            this.data.id = options.id;
        }

        if (options.attributes) {
            this.data.attributes = options.attributes;
        }

        if (options.relationships) {
            this.data.relationships = options.relationships;
        }
    }
}
