import * as JsonApi from "../jsonapi/index";
import { Id, State, Events, Time } from "../common/structures";
import { Location } from "./datacenters";

export interface InstanceCollection extends JsonApi.CollectionDocument {
    data: InstanceResource[];
}

export interface Instance extends JsonApi.ResourceDocument {
    data: InstanceResource | null;
}

export interface InstanceLog extends JsonApi.ResourceDocument {
    data: {
        id: Id;
        type: string;
        attributes: {
            events: Events;
            output: string;
            type: string;
        };
        relationships: {
            instance: JsonApi.ToOneRelationship;
        };
    };
}

export type InstanceState = "starting" | "running" | "stopping" | "stopped" | "deleting" | "deleted" | "error";
export interface InstanceResource extends JsonApi.Resource {
    id: Id;
    type: "instances";
    attributes: {
        hostname: string;
        volumes: InstanceVolume[];
        state: State<InstanceState>;
        location: Location;
        events: Events & {
            first_boot: Time;   
            started: Time;
        };
    };

    relationships?: {
        environment: JsonApi.ToOneRelationship;
        container: JsonApi.ToOneRelationship;
    };

    meta: {
        location?: {
            continent: string;
            country: string;
            city: string;
            state: string;
        };

        networks?: {
            id: string;
            gateway: string;
            broadcast: string;
            name: string;
            cidr: string;
            type: string;
            assignment: {
                ip: {
                    address: string;
                    mask: number;
                };
            };
            instance: string;
            released: string;
            claimed: string;
        }[];
    };
}

export interface InstanceVolume {
    container_volume: Id;
    path: string;
    password: string;
}

// List of container instance documents
export type LogTypes = "startup_process_first" | "startup_process";
