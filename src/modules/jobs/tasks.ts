import { Id, Time, Events, State } from "../../common/structures";
import { States } from "./jobs";

export interface Resource {
    id: Id;
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
    id: Id;
    extra: {[key: string]: any};
}
