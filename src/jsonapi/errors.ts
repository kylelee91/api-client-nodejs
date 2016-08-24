import { ErrorDocument, ErrorDetail } from "./structures";

export class JsonApiError extends Error implements ErrorDocument {
    public errors: ErrorDetail[] = [];

    constructor(e?: JsonApiError) {
        super();
        console.log("New JSON API Error: ", e);
        if (!e) {
            console.log("No error passed to constructor. returning.");
            return;
        }

        if (e.errors) {
            console.log("Errors object present");
            this.errors = e.errors;
        }

        // Standardize error format
        if (this.errors.length) {
            console.log("Errors has length", this.errors, this.errors.length);
            this.name = <string>e.errors[0].title;
            this.message = <string>e.errors[0].detail;
        } else {
            console.log("Injecting error: ", e);
            this.errors = [<ErrorDetail>e];
        }
    }
}

export class RequestTimeoutError extends JsonApiError {
    constructor() {
        super();
        this.name = "JsonApi: Request timed out";
    }
}

export class RequestFailedError extends JsonApiError {
    constructor(error?: string) {
        super();
        this.name = `JsonApi: ${error || "Request failed"}`;
    }
}

export class InvalidMethodError extends JsonApiError {
    constructor() {
        super();
        this.name = "JsonApi: Method not allowed";
    }
}

export class InvalidResponseError extends JsonApiError {
    constructor(error?: string) {
        super();
        this.name = `JsonApi: ${error || "JsonApi: Unable to decode JSON response data"}`;
    }
}
