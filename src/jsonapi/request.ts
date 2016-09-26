export class JsonApiRequest extends Request {
    constructor(input: RequestInfo, init?: RequestInit) {
        const jsoninit: RequestInit = {
            method: "GET",
            headers: new Headers({
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json"
            }),
            mode: "cors",
            credentials: "omit",
            cache: "no-cache"
        };

        // merge together
        super(new Request(input, jsoninit), init);
    }
}

export function timeout(f: Promise<IResponse>, t: number) {
    return Promise.race([
        f,
        new Promise((_, rej) => setTimeout(() => rej(new Error("Request Timeout")), t))
    ]);
}

export async function retry(req: JsonApiRequest): Promise<IResponse> {
    try {
        return fetch(new JsonApiRequest(req));
    } catch (e) {
        await new Promise(res => setTimeout(() => res(), 2000));
        return retry(req);
    }
}
