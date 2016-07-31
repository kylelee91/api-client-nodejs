import { ErrorDocument, ErrorDetail } from "./structures";

export class JsonApiError extends Error implements ErrorDocument {
    public errors: ErrorDetail[]  = [];

    constructor(e?: JsonApiError) {
        super();
        if (!e) {
            return;
        }

        if (e.errors) {
            this.errors = e.errors;
        }

        // Standardize error format
        if (this.errors.length) {
            this.name = <string>e.errors[0].title;
            this.message = <string>e.errors[0].detail;
        } else {
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
    constructor() {
        super();
        this.name = "JsonApi: Request failed";
    }
}

export class InvalidMethodError extends JsonApiError {
    constructor() {
        super();
        this.name = "JsonApi: Method not allowed";
    }
}

export class InvalidResponseError extends JsonApiError {
    constructor() {
        super();
        this.name = "JsonApi: Unable to decode JSON response data";
    }
}
