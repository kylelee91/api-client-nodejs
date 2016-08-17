import * as Containers from "../containers/index";
import { Id, Time } from "../../common/structures";

export interface Term {
    start: Time;
    end: Time;
}

export interface ContainerLineItem {
    id: Id;
    name: string;
    environment: string;
    state: Containers.States;
    due: number;
    instances: InstanceLineItem[];
}

export interface InstanceLineItem {
    id: Id;
    hostname: string;
    usage: InstanceUsage[];
    state: Containers.Instances.States;
    due: number;
}

export interface InstanceUsage {
    term: Term;
    state: string;
    due: number;
    hours: number;
}

export interface Profile {
    term: Term;
    tier: Id;
    restrictions: {
        containers: number;
    };
}
