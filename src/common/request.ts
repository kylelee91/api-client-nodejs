export const ApiRequestInit: RequestInit = {
    method: "GET",
    headers: new Headers({
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json"
    }),
    mode: "cors",
    credentials: "omit",
    cache: "no-cache"
};

export function timeout(f: Promise<IResponse>, t: number) {
    return Promise.race([
        f,
        new Promise((_, rej) => setTimeout(() => rej(new Error("Request Timeout")), t))
    ]);
}

export async function retry(req: Request): Promise<IResponse> {
    try {
        return fetch(req);
    } catch (e) {
        await new Promise(res => setTimeout(() => res(), 2000));
        return retry(req);
    }
}
