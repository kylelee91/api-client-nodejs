import { CollectionDoc, SingleDoc, Resource, ResourceId, Time } from "../../common/structures";

export interface Collection extends CollectionDoc {
    data: Logins[];
}

export interface Single extends SingleDoc {
    data: Logins | null;
}

export interface Logins extends Resource {
    id: ResourceId;
    account: string;
    time: Time;
    success: string;
}
