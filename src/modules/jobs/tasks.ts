import { Id, Time, Events } from "../../common/structures";

export interface Resource {
    id: Id;
    topic: string;
    caption: string;
    action: string;
    steps: Step[];
    events: Events;
    error: {
        block: boolean;
        time: string;
        message: string;
    };
    async: boolean;
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
    additional: {[key: string]: any};
}
