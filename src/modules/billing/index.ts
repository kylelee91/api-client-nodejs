import * as Expected from "./expected";
import * as Invoices from "./invoices";
import * as Methods from "./methods";
import * as Services from "./services";
import * as Credits from "./credits";
import { Time } from "../../common/structures";

export * from "./common";

export interface Suspension {
    time: Time;
    reason: string;
    grace_period: Time;
    purged: Time;
}

export {
    Expected,
    Invoices,
    Methods,
    Services,
    Credits
};
