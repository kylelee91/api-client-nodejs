import { CollectionDoc, SingleDoc, Resource, ResourceId, Time } from "../../common/structures";

export interface Collection extends CollectionDoc {
    data: Login[];
}

export interface Single extends SingleDoc {
    data: Login | null;
}

export interface Login extends Resource {
    account: string;
    time: Time;
    success: string;
}
