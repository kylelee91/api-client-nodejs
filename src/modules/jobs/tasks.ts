import { Resource, ResourceId, Time, Events, State } from "../../common/structures";
import { States } from "./jobs";

export interface Task extends Resource {
    id: ResourceId;
    topic: string;
    caption: string;
    action: string;
    steps: Step[];
    events: Events & {
        queued: Time;
    };
    error: {
        message: string;
    };
    async: boolean;
    state: State<States>;
    contents: ContentsStructure;
    require: boolean;
}

export interface Step {
    caption: string;
    started: Time;
    completed: Time;
}

export interface ContentsStructure {
    id: ResourceId;
    extra: {[key: string]: any};
}
