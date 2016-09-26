// import * as Errors from "./errors";
// import * as SuperAgent from "superagent";

// export type Methods = "get" | "post" | "patch" | "delete";

// export default class <T> {
//     /**
//      * Method type used for request
//      */
//     public method: Methods = "get";

//     /**
//      * Query object
//      */
//     public query: { [key: string]: any } = {};

//     /**
//      * Timeout in seconds
//      */
//     public timeout = 10;

//     /**
//      * Number of times to retry request
//      */
//     public maxAttempts = 3;

//     /**
//      * Data to be sent with the request
//      */
//     public data: { [key: string]: any } = {};

//     /**
//      * Current progress of request if supported
//      */
//     protected _progress: ProgressEvent;

//     /**
//      * Headers sent with request
//      */
//     protected headers: { name: string; value: string }[] = [];

//     /**
//      * # of attempts so far on this request
//      */
//     protected attempts = 0;

//     /**
//      * If timed out, flag gets set
//      */
//     private didTimeout: boolean = false;

//     constructor(protected target: string) {
//         this.setHeader("Accept", "application/vnd.api+json");
//         this.setHeader("Content-Type", "application/vnd.api+json");
//     }

//     public setHeader(name: string, value: string): void {
//         const h = this.headers.find(t => t.name === name);
//         if (h) {
//             h.value = value;
//             return;
//         }

//         this.headers.push({ name: name, value: value });
//     }

//     public get progress() {
//         return this._progress;
//     }

//     public set cache(c: boolean) {
//         if (!c) {
//             this.query["_"] = new Date().getTime();
//         }
//     }

//     public async send() {
//         let resp = await this.sendWrapper();

//         return resp;
//     }

//     private makeRequest() {
//         let req: SuperAgent.Request = SuperAgent[this.method](this.target + this.formatQuery());
//         this.headers.forEach((header) => {
//             req = req.set(header.name, header.value);
//         });

//         req = req.on("progress", (progress: any) => {
//             this._progress = progress;
//         });

//         req = req.timeout(this.timeout * 1000);
//         return req.send(this.data);
//     }

//     private formatQuery(): string {
//         let formatted: string = "?";

//         for (let key in this.query) {
//             if (this.query.hasOwnProperty(key)) {
//                 formatted = formatted.concat(key + "=" + this.query[key] + "&");
//             }
//         }
//         return formatted;
//     }

//     private async sendWrapper(): Promise<T> {
//         // Check retry attempts
//         this.attempts++;
//         if (this.attempts > this.maxAttempts) {
//             throw this.didTimeout
//                 ? new Errors.RequestTimeoutError
//                 : new Errors.RequestFailedError("Max attempts reached");
//         }

//         let resp: SuperAgent.Response;
//         try {
//             // Hack to support superagent promise
//             resp = await <SuperAgent.Response | any>this.makeRequest();
//         } catch (err) {
//             if (err.timeout) {
//                 this.didTimeout = true;
//                 // Potential max of three layers deep of promises?
//                 return await this.sendWrapper();
//             }

//             // Superagent sets this flag if the request fails to go through due to network
//             if (err.crossDomain) {
//                 // Artificial wait
//                 await new Promise(res => setTimeout(() => res(), this.timeout * 1000));
//                 return await this.sendWrapper();
//             }

//             // Other non-infrastructure related errors
//             let throwable: Errors.JsonApiError;
//             try {
//                 throwable = new Errors.JsonApiError(JSON.parse(err.response.text));
//             } catch (e) {
//                 // In case response couldn't be decoded
//                 const error = {
//                     name: err.text,
//                     message: err.text,
//                     errors: e.body
//                 };

//                 throwable = new Errors.JsonApiError(error);
//             }

//             throw throwable;
//         }

//         // Success
//         try {
//             return resp.body || JSON.parse(resp.text);
//         } catch (e) {
//             throw new Errors.InvalidResponseError();
//         }
        
//     }
// }
