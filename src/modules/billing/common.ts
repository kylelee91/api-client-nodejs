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
    scaling: string;
    instances: InstanceLineItem[];
}

export interface InstanceLineItem {
    id: Id;
    hostname: string;
    usage: InstanceUsage[];
    state: Containers.Instances.States;
    due: number;
}

export interface VolumeLineItem {
    path: string;
    plan: {
        id: Id;
        name: string;
        price: number;
    };
    due: number;
}

export interface InstanceUsage {
    term: Term;
    state: string;
    due: number;
    hours: number;
    volumes: VolumeLineItem[];
}

export interface Profile {
    term: Term;
    tier: Id;
    disable?: boolean;
    restrictions: {
        containers: number;
    };
}
