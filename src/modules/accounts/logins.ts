import { CollectionDoc, SingleDoc, Resource, ResourceId, Time } from "../../common/structures";
import { Account } from "../accounts";
import { Employee } from "../employees";

export interface Collection extends CollectionDoc {
    data: Login[];
    includes?: {
        accounts: {[key: string]: Account};
        employees: {[key: string]: Employee}
    };
}

export interface Single extends SingleDoc {
    data: Login | null;
}

export interface Login extends Resource {
    account: {
        id: ResourceId;
        ip?: string;
    };
    employee?: {
        id: ResourceId;
    };
    time: Time;
    type: "password" | "employee";
    success: string;
}
