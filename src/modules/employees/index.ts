import { Resource, Time } from "../../common/structures";

export interface Employee extends Resource {
    name: {
        first: string;
        last: string;
    };
    email: {
        address: string;
        verified: boolean;
        added: Time;
    };
    username: string;
    position: string;
    department: string[];
}
