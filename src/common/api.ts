import Cache from "./cache";
import Settings from "settings";
import { ApiRequestInit } from "./request";
import { QueryParams } from "./structures";
import { ErrorResource } from "./errors";

export type ApiResult<T> = ResultSuccess<T> | ResultFail<ErrorResource>;

export interface ResultSuccess<T> {
    ok: true;
    value: T;
}

export interface ResultFail<T> {
    ok: false;
    error: T;
}

export async function get<T>(target: string, query?: QueryParams): Promise<ApiResult<T>> {
    if (Settings.cache && Settings.cache.use) {
        const c = Cache.get<ResultSuccess<T>>(target, query, Settings.team);
        if (c) {
            return c;
        }
    }

    const req = new Request(`${Settings.url}/v${Settings.version}/${target}?${formatParams(query)}`, ApiRequestInit);
    embedTeam(req);
    let resp = await makeRequest<T>(req);
    if (resp.ok && Settings.cache && Settings.cache.use) {
        Cache.set(target, resp, query, Settings.team, Settings.cache.refresh);
    }
    return resp;
}

export async function post<T>(target: string, doc: Object, query?: QueryParams): Promise<ApiResult<T>> {
    const req = new Request(
        `${Settings.url}/v${Settings.version}/${target}?${formatParams(query)}`,
        Object.assign({
            method: "POST",
            body: JSON.stringify(doc)
        }, ApiRequestInit)
    );

    embedTeam(req);
    let resp = await makeRequest<T>(req);
    return resp;
}

export async function patch<T>(target: string, doc: Object, query?: QueryParams): Promise<ApiResult<T>> {
    const req = new Request(
        `${Settings.url}/v${Settings.version}/${target}?${formatParams(query)}`,
        Object.assign(ApiRequestInit, {
            method: "PATCH",
            body: JSON.stringify(doc)
        })
    );

    embedTeam(req);
    let resp = await makeRequest<T>(req);
    return resp;
}

export async function del<T>(target: string, query?: QueryParams): Promise<ApiResult<T>> {
    const req = new Request(
        `${Settings.url}/v${Settings.version}/${target}?${formatParams(query)}`,
        Object.assign(ApiRequestInit, {
            method: "DELETE",
        })
    );

    embedTeam(req);
    let resp = await makeRequest<T>(req);
    return resp;
}

async function makeRequest<T>(req: Request): Promise<ApiResult<T>> {
    if (!Settings.storage) {
        throw new Error("No token storage in settings.");
    }

    const token = Settings.storage.read();
    if (!token) {
        throw new Error("You must load a token before attempting a request.");
    }

    req.headers.append("Authorization", `Bearer ${token.access_token}`);

    try {
        //TODO: Do Timeout Here?
        const resp = await fetch(req);
        if (!resp.ok) {
            return {
                ok: false,
                error: await resp.json<ErrorResource>()
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
                title: "Unable to reach server",
                detail: "There was an error attempting to fetch data from server."
            }
        };
    }
}

function formatParams(q: QueryParams | undefined) {
    if (!q) {
        return "";
    }

    const f = {};

    if (q.include) {
        f["include"] = q.include.join(",");
    }

    if (q.extra) {
        f["extra"] = q.extra.join(",");
    }

    if (q.embed) {
        f["embed"] = q.embed.join(",");
    }

    if (q.filter) {
        for (let prop in q.filter) {
            let p = encodeURIComponent(prop);
            if (q.filter[p]) {
                f["filter[" + p + "]"] = encodeURIComponent(q.filter[prop]);
            }
        }
    }

    if (q.page) {
        f["page[number]"] = q.page.number;
        f["page[size]"] = q.page.size;
    }

    if (q.limit) {
        f["limit"] = q.limit;
    }

    if (q.sort) {
        f["sort"] = q.sort.join(",");
    }

    return Object.keys(f)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(f[k]))
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
