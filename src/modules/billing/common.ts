import * as Containers from "../../modules/containers/index";
import { ResourceId, Time } from "../../common/structures";

export interface Term {
    start: Time;
    end: Time;
}

export interface ContainerLineItem {
    id: ResourceId;
    name: string;
    environment: string;
    state: Containers.States;
    due: number;
    scaling: string;
    instances: InstanceLineItem[];
}

export interface InstanceLineItem {
    id: ResourceId;
    hostname: string;
    usage: InstanceUsage[];
    state: Containers.Instances.States;
    due: number;
}

export interface VolumeLineItem {
    path: string;
    plan: {
        id: ResourceId;
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
    plan: {
        id: string;
        name: string;
        price: number;
    };
}

export interface Profile {
    trial?: Trial;
    term: Term;
    tier: ResourceId;
    disable?: boolean;
    restrictions: {
        containers: number;
    };
}

export interface Trial {
    start: Time;
    end: Time;
    ended: Time;
}
