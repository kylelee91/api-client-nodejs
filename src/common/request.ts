import * as JsonApi from "../jsonapi/index";
import * as Auth from "../auth/index";
import Cache from "../common/cache";
import Settings from "../common/settings";
import { Id } from "./structures";

let url = Settings.url;

export interface QueryParams {
    include?: string[];
    extra?: string[];
    sort?: string[];
    limit?: number;
    embed?: string[];
    filter?: {[key: string]: string};
    page?: {
        number: number;
        size: number;
    };
    /**
     * Override team set in settings for this request
     */
    team?: Id;
}

export function setUrl(n: string) {
    url = n;
}

export async function _get<T>(target: string, query?: QueryParams): Promise<T> {
    if (Settings.cache.use) {
        const c = Cache.get(target, query);
        if (c) {
            return Promise.resolve(c);
        }
    }

    const req = new JsonApi.Request<T>(url + target);
    req.method = "get";
    req.options = format(query) || {};
    embedTeam(req, query);

    if (!Settings.cache.use) {
        return Auth.signRequest<T>(req);
    }

    const resp = Auth.signRequest<T>(req);
    Cache.set(target, resp, query, Settings.cache.timeout);
    return resp;
}

export async function _post<T>(target: string, document: JsonApi.Document, query?: QueryParams): Promise<T> {
    const req = new JsonApi.Request<T>(url + target);
    req.method = "post";
    req.data = document;
    req.options = format(query) || {};
    embedTeam(req, query);    
    return Auth.signRequest<T>(req);
}

export async function _patch<T>(target: string, document: JsonApi.Document, query?: QueryParams): Promise<T> {
    const req = new JsonApi.Request<T>(url + target);
    req.method = "patch";
    req.data = document;
    req.options = format(query) || {};
    embedTeam(req, query);    
    return Auth.signRequest<T>(req);
}

export async function _delete<T>(target: string, query?: QueryParams): Promise<T> {
    const req = new JsonApi.Request<T>(url + target);
    req.method = "delete";
    req.options = format(query) || {};
    embedTeam(req, query);    
    return Auth.signRequest<T>(req);
}


function format(q: QueryParams | undefined) {
    if (!q) {
        return;
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

    return f;
}

function embedTeam(req: JsonApi.Request<any>, options?: QueryParams) {
    if (Settings.team) {
        req.setHeader("X-Team-Id", Settings.team);
    }

    if (options && options.team) {
        req.setHeader("X-Team-Id", options.team);
    }

    return req;
}
