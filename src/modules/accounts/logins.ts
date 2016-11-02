import { CollectionDoc, SingleDoc, Resource, ResourceId, Time } from "common/structures";

export interface Collection extends CollectionDoc {
    data: Logins[];
}

export interface Single extends SingleDoc {
    data: Logins | null;
}

export interface Logins extends Resource {
    readonly id: ResourceId;
    readonly account: string;
    readonly time: Time;
    readonly success: string;
}
