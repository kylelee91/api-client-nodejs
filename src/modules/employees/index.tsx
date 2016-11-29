import { Resource, State } from "../../common/structures";

export interface Employee extends Resource {
    name: {
        first: string;
        last: string;
    };
    email: {
        address: string;
        verified: boolean;
        added: string // Time
    };
    username: string;
    position: string;
    department: string[];
    state: State<"active"|"suspended">;
}
