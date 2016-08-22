import * as Errors from "./errors";
import * as SuperAgent from "superagent";
import { ErrorDetail } from "./structures";

export class Request<T> {
    protected target: string;

    protected headers: { name: string; value: string }[] = [];

    protected _method: string;

    protected _timeout: number = 10;

    protected _data: {} = {};

    protected _options: {} = {};

    protected _progress: ProgressEvent;

    protected _retries: number = 0;

    protected max_retries: number = 3;

    protected promise: Promise<T>;

    protected results: {
        resolve: (v: T) => void,
        reject: (v: Error) => void
    } = {
        resolve: (v: T) => {
            //
        },
        reject: (v: Error) => {
            //
        }
    };

    constructor(target: string) {
        this.target = target;
        this.setHeader("Accept", "application/vnd.api+json");
        this.setHeader("Content-Type", "application/vnd.api+json");
        this.timeout = 10;

        this.promise = new Promise<T>((res, rej) => {
            this.results.resolve = res;
            this.results.reject = rej;
        });

    }

    public setHeader(name: string, value: string): void {
        const h = this.headers.find(t => t.name === name);
        if (h) {
            h.value = value;
            return;
        }

        this.headers.push({ name: name, value: value });
    }

    public set options(options: {}) {
        this._options = options;
    }

    public get options() {
        return this._options;
    }

    public set cache(c: boolean) {
        if (!c) {
            this._options["_"] = new Date().getTime();
        }
    }

    public set method(method: string) {
        let allowed = [
            "get",
            "post",
            "patch",
            "delete"
        ];

        method = method.toLowerCase();

        if (allowed.indexOf(method) === -1) {
            throw new Errors.InvalidMethodError();
        }

        this._method = method;
    }

    public set timeout(seconds: number) {
        this._timeout = seconds * 1000;
    }

    public set data(data: {}) {
        this._data = data;
    }

    public get progress() {
        return this._progress;
    }


    public send() {
        return this.buildRequest();
    }

    // Need to be able to reuse a promise resolve/reject
    // so that we can continue a try catch chain if 
    // send is called from within this function.
    private buildRequest(): Promise<T> {
        this._retries++;

        if (!this._method) {
            this._method = "get";
        }

        this.target = this.target + this.formatOptions();

        let req: SuperAgent.Request = SuperAgent[this._method](this.target);
        if (!req) {
            const err = {
                status: "422",
                title: "Invalid Input",
                detail: "Invalid request method"
            };
            this.results.reject(new Errors.JsonApiError({
                errors: [err],
                name: "Invalid Input",
                message: "Invalid request method"
            }));
            return this.promise;
        }

        this.headers.forEach((header) => {
            req = req.set(header.name, header.value);
        });

        req.on("progress", (progress: any) => {
            this._progress = progress;
        })
            .timeout(this._timeout)
            .send(JSON.stringify(this._data))
            .end((err, resp) => {
                if (!resp) {
                    this._retry(new Errors.RequestFailedError());
                } else if (!err) {
                    this.results.resolve(JSON.parse(resp.text));
                } else if (err.timeout) {
                    this._retry(new Errors.RequestTimeoutError());
                } else {
                    try {
                        this.results.reject(new Errors.JsonApiError(JSON.parse(resp.text)));
                    } catch (e) {
                        try {
                            const error = {
                                name: resp.text,
                                message: resp.text,
                                errors: <ErrorDetail[]>[{
                                    status: String(resp.status),
                                    detail: resp.text
                                }]
                            };
                            this.results.reject(new Errors.JsonApiError(error));
                        } catch (e) {
                            this.results.reject(new Errors.InvalidResponseError());
                        }
                    }
                }
            });

        return this.promise;
    }

    private _retry(err: Errors.JsonApiError) {
        if (this._retries <= this.max_retries || this.max_retries === null) {
            if (this._retries > 1) {
                setTimeout(() => {
                    this.buildRequest();
                }, this._timeout);
            } else {
                this.buildRequest();
            }
            return;
        }
        this.results.reject(err);
    }

    private formatOptions(): string {
        let formatted: string = "?";

        for (let key in this._options) {
            if (this._options.hasOwnProperty(key)) {
                formatted = formatted.concat(key + "=" + this._options[key] + "&");
            }
        }
        return formatted;
    }
}
