import { IdResults } from "./common";
import { Environments } from "../src";

export function create(): IdResults {
    return {
        id: "", // -> Id from the call
        results: {
            message: "", // message to display in console
            status: 200 // 200, 500 etc. What is the HTTP status code of the request
            //...etc
        }
    };
}

export function update(id: string, doc: Environments.NewParams) {
    // again
}
