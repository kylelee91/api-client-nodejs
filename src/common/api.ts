import Cache from "./cache";
import Settings from "../settings";
import { ApiRequestInit } from "./request";
import { QueryParams } from "./structures";
import { ErrorResource } from "./errors";
import { OAuthToken } from "../auth/token";

export type ApiResult<T> = ResultSuccess<T> | ResultFail<ErrorResource>;

export interface ResultSuccess<T> {
    ok: true;
    value: T;
}

export interface ResultFail<T> {
    ok: false;
    error: T;
}

export async function get<T>(target: string, query?: QueryParams, token?: OAuthToken): Promise<ApiResult<T>> {
    if (!token) {
        token = Settings.storage.read();
    }

    if (Settings.cache && Settings.cache.use) {
        const c = Cache.get<ResultSuccess<T>>(target, query, Settings.team);
        if (c) {
            return c;
        }
    }

    const req = new Request(`${Settings.url}/v${Settings.version}/${target}?${formatParams(query)}`, ApiRequestInit);
    embedTeam(req);
    let resp = await makeRequest<T>(req, token);
    if (resp.ok && Settings.cache && Settings.cache.use) {
        Cache.set(target, resp, query, Settings.team, Settings.cache.refresh);
    }
    return resp;
}

export async function post<T>(target: string, doc: Object, query?: QueryParams, token?: OAuthToken): Promise<ApiResult<T>> {
    if (!token) {
        token = Settings.storage.read();
    }

    const req = new Request(
        `${Settings.url}/v${Settings.version}/${target}?${formatParams(query)}`,
        Object.assign({}, ApiRequestInit, {
            method: "POST",
            body: JSON.stringify(doc)
        })
    );

    embedTeam(req);
    let resp = await makeRequest<T>(req, token);
    return resp;
}

export async function patch<T>(target: string, doc: Object, query?: QueryParams, token?: OAuthToken): Promise<ApiResult<T>> {
    if (!token) {
        token = Settings.storage.read();
    }

    const req = new Request(
        `${Settings.url}/v${Settings.version}/${target}?${formatParams(query)}`,
        Object.assign({}, ApiRequestInit, {
            method: "PATCH",
            body: JSON.stringify(doc)
        })
    );

    embedTeam(req);
    let resp = await makeRequest<T>(req, token);
    return resp;
}

export async function del<T>(target: string, query?: QueryParams, token?: OAuthToken): Promise<ApiResult<T>> {
    if (!token) {
        token = Settings.storage.read();
    }

    const req = new Request(
        `${Settings.url}/v${Settings.version}/${target}?${formatParams(query)}`,
        Object.assign({}, ApiRequestInit, {
            method: "DELETE",
        })
    );

    embedTeam(req);
    let resp = await makeRequest<T>(req, token);
    return resp;
}

async function makeRequest<T>(req: Request, token: OAuthToken | undefined): Promise<ApiResult<T>> {
    if (!Settings.storage) {
        throw new Error("No token storage in settings.");
    }

    if (!token) {
        throw new Error("You must load a token before attempting a request.");
    }

    req.headers.append("Authorization", `Bearer ${token.access_token}`);

    try {
        const resp = await fetch(req);
        if (!resp.ok) {
            const error = await resp.json();
            return {
                ok: false,
                error: error.error
            };
        }

        const result = await resp.json<T>();
        return {
            ok: true,
            value: result
        };
    } catch (e) {
        return {
            ok: false,
            error: {
                status: 0,
                title: "Unable to reach server",
                detail: "There was an error attempting to fetch data from server.",
                code: "0.network_error"
            }
        };
    }
}

function formatParams(q: QueryParams | undefined) {
    if (!q) {
        return "";
    }

    let result = {};
    function recurse(cur: any, prop: any) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            result[prop] = cur.join(",");
        } else {
            let isEmpty = true;
            for (let p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + "[" + p + "]" : p);
            }
            if (isEmpty && prop) {
                result[prop] = {};
            }
        }
    }
    recurse(q, "");

    return Object.keys(result)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(result[k]))
        .join("&");
}

function embedTeam(req: Request, options?: QueryParams) {
    if (Settings.team) {
        req.headers.append("X-Team-Id", Settings.team);
    }

    if (options && options.team) {
        req.headers.append("X-Team-Id", options.team);
    }
}
