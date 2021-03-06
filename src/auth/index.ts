import { OAuthError } from "../common/errors";
import { Token } from "./token";
import { ApiResult } from "../common/api";
import Settings from "../settings";
export { Token }

export interface PasswordAuth {
    username: string;
    password: string;
    client_id?: string;
    client_secret?: string;
}

export async function passwordAuth(options: PasswordAuth): Promise<ApiResult<Token>> {
    // Exceptions thrown ONLY IF the API client can't function
    if (!Settings.storage) {
        throw new Error("No token storage defined in settings. Refusing to make request.");
    }

    if (!Settings.auth) {
        throw new Error("No authorization url defined in settings. Refusing to make request.");
    }

    let queryParams = Object.keys(options)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(options[k]))
        .join("&");

    try {
        const resp = await fetch(Settings.auth.tokenUrl, {
            method: "POST",
            body: `grant_type=password&${queryParams}`,
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "application/json"
            }
        });
        if (!resp.ok) {
            const err = await resp.json<OAuthError>();
            return {
                ok: false,
                error: {
                    status: resp.status,
                    detail: err.error_description,
                    title: err.error
                }
            };
        }

        const token = await resp.json<Token>();
        Settings.storage.write(token);
        return {
            ok: true,
            value: token
        };
    } catch (e) {
        return {
            ok: false,
            error: {
                detail: e.message,
                title: "Unable to reach authentication server"
            }
        };
    }
}

export async function refreshAuth(): Promise<ApiResult<Token>> {
    interface Params {
        grant_type: "refresh_token";
        refresh_token: string;
        client_id?: string;
        client_secret?: string;
    }

    if (!Settings.storage) {
        throw Error("No token storage defined in settings. Refusing to make request.");
    }

    if (!Settings.auth) {
        throw Error("No refresh url defined in settings. Refusing to make request.");
    }

    const token = Settings.storage.read();
    if (!token) {
        throw new Error("You must load a token before attempting a request.");
    }

    const options: Params = {
        "grant_type": "refresh_token",
        "refresh_token": token.refresh_token
    };

    let queryParams = Object.keys(options)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(options[k]))
        .join("&");

    try {
        const resp = await fetch(Settings.auth.refreshUrl, {
            method: "POST",
            body: queryParams,
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "application/json"
            }
        });
        if (!resp.ok) {
            const err = await resp.json<OAuthError>();
            return {
                ok: false,
                error: {
                    status: resp.status,
                    detail: err.error_description,
                    title: err.error
                }
            };
        }

        const refresh = await resp.json<Token>();
        Settings.storage.write(refresh);
        return {
            ok: true,
            value: refresh
        };
    } catch (e) {
        return {
            ok: false,
            error: {
                code: "0.network_error",
                detail: e.message,
                title: "Unable to reach authentication server"
            }
        };
    }
}

export async function apiKeyAuth(options: {secret: string}): Promise<ApiResult<Token>> {
    // Exceptions thrown ONLY IF the API client can't function
    if (!Settings.storage) {
        throw new Error("No token storage defined in settings. Refusing to make request.");
    }

    if (!Settings.auth) {
        throw new Error("No authorization url defined in settings. Refusing to make request.");
    }

    let queryParams = Object.keys(options)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(options[k]))
        .join("&");

    try {
        const resp = await fetch(Settings.auth.tokenUrl, {
            method: "POST",
            body: `grant_type=api_key&${queryParams}`,
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "application/json"
            }
        });
        if (!resp.ok) {
            const err = await resp.json<OAuthError>();
            return {
                ok: false,
                error: {
                    status: resp.status,
                    detail: err.error_description,
                    title: err.error
                }
            };
        }

        const token = await resp.json<Token>();
        Settings.storage.write(token);
        return {
            ok: true,
            value: token
        };
    } catch (e) {
        return {
            ok: false,
            error: {
                detail: e.message,
                title: "Unable to reach authentication server"
            }
        };
    }
}
