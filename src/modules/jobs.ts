import * as JsonApi from "../jsonapi/index";
import * as ApiRequest from "../common/request";
import { Id, Time, State, Events } from "../common/structures";

export function document(): typeof JobsRequest;
export function document(id: string): JobRequest;
export function document(id?: string): JobsRequest | JobRequest {
    if (!id) {
        return JobsRequest;
    }

    return new JobRequest(id);
}

export interface JobCollection extends JsonApi.CollectionDocument {
    data: JobResource[];
}

export interface Job extends JsonApi.ResourceDocument {
    data: JobResource;
}

export type JobState = "new" | "running" | "expired" | "completed";
export interface JobResource {
    id: Id;
    type: "jobs";
    attributes: {
        caption: string;
        expires: Time;
        queue: string;
        scheduled: Time;
        state: State<JobState>;
        tasks: JobTask[];
        events: Events & {
            started: Time;
            completed: Time;
        };
    };
    relationships?: {
        account: JsonApi.ToOneRelationship;
    };
}

export interface JobTaskStep {
    caption: string;
    started: Time;
    completed: Time;
}

export interface JobTask {
    id: Id;
    topic: string;
    action: string;
    steps: JobTaskStep[];
    events: Events;
    error: {
        block: boolean;
        time: string;
        message: string;
    };
    async: boolean;
    contents: TaskContents;
    require: boolean;
}

export interface TaskContents {
    id: Id;
    additional: {[key: string]: any};
}

export class JobsRequest {
    public static async get(query?: ApiRequest.QueryParams): Promise<JobCollection> {
        return ApiRequest._get<JobCollection>("jobs", query);
    }
}

export class JobRequest {
    private target: string;

    constructor(id: string) {
        this.target = `jobs/${id}`;
    }

    public async get(query?: ApiRequest.QueryParams): Promise<Job> {
        return ApiRequest._get<Job>(this.target, query);
    }
}

