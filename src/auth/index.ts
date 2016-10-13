import { ErrorDetail } from "../jsonapi";
import { OAuthError } from "../common/errors";
import { Token } from "./token";
import { ResultFail, ResultSuccess } from "../common/structures";
import Settings from "../settings";
// import ThreadedLock from "threaded-lock";

export interface PasswordAuth {
    username: string;
    password: string;
    client_id?: string;
    client_secret?: string;
}

export async function passwordAuth(options: PasswordAuth): Promise<ResultSuccess<Token> | ResultFail<ErrorDetail>> {
    // Exceptions thrown ONLY IF the API client can't function
    if (!Settings.storage) {
        throw Error("No token storage defined in settings. Refusing to make request.");
    }

    if (!Settings.auth) {
        throw Error("No authorization url defined in settings. Refusing to make request.");
    }

    if (Settings.client && (!options.client_id || !options.client_secret)) {
        options.client_id = Settings.client.id;
        options.client_secret = Settings.client.secret;
    }

    let queryParams = Object.keys(options)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(options[k]))
        .join("&");

    // const req = new JsonApi.Request<Token>(Settings.auth.tokenUrl);
    const req = new Request(`${Settings.auth.tokenUrl}?grant_type=password&${queryParams}`, {
        method: "POST",
    });

    try {
        const resp = await fetch(req);
        if (!resp.ok) {
            const err = await resp.json<OAuthError>();
            return {
                ok: false as false,
                error: {
                    status: resp.status.toString(),
                    detail: err.error_description,
                    title: err.error
                }
            };
        }

        const token = await resp.json<Token>();
        Settings.storage.write(token);
        return {
            ok: true as true,
            value: token
        };
    } catch (e) {
        return {
            ok: false as false,
            error: {
                detail: e.message,
                title: "Unable to reach authentication server"
            }
        };
    }
}

export async function refreshAuth(): Promise<ResultSuccess<Token> | ResultFail<ErrorDetail>> {
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

    // TODO: Should we throw an exception here?
    const token = Settings.storage.read();
    if (!token) {
        throw Error("No token in storage.");
    }

    const options: Params = {
        "grant_type": "refresh_token",
        "refresh_token": token.refresh_token
    };

    if (Settings.client) {
        options.client_id = Settings.client.id;
        options.client_secret = Settings.client.secret;
    }

    let queryParams = Object.keys(options)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(options[k]))
        .join("&");

    const req = new Request(`${Settings.auth.refreshUrl}?grant_type=password&${queryParams}`, {
        method: "POST",
    });

    try {
        const resp = await fetch(req);
        if (!resp.ok) {
            const err = await resp.json<OAuthError>();
            return {
                ok: false as false,
                error: {
                    status: resp.status.toString(),
                    detail: err.error_description,
                    title: err.error
                }
            };
        }

        const refresh = await resp.json<Token>();
        Settings.storage.write(refresh);
        return {
            ok: true as true,
            value: refresh
        };
    } catch (e) {
        return {
            ok: false as false,
            error: {
                detail: e.message,
                title: "Unable to reach authentication server"
            }
        };
    }
}

// export async function signRequest<T>(req: Request): Promise<T> {
//     if (!Settings.storage) {
//         throw Error("No token storage defined in settings. Refusing to make request.");
//     }

//     const token = Settings.storage.read();
//     req.setHeader("Authorization", "Bearer " + token.access_token);

//     try {
//         resp = await req.send();
//     } catch (e) {
//         const eType = Errors.identify(e);

//         if ((eType instanceof Errors.TokenNotAuthorizedError) === false) {
//             throw eType;
//         }

//         // Handles the following case:
//         // 1) Token expires with failed request
//         // 2) Another request with expired token is made
//         // 3) Refresh token request initiated and completes (unlocking this function)
//         // 4) Expired token request completes, tries to do refresh with old token and fails
//         let threadedLock: ThreadedLock | undefined;
//         if (window && window.localStorage) {
//             threadedLock = new ThreadedLock("refresh_lock");
//             await threadedLock.lock();
//         }
//         const currentToken = readToken();
//         if (currentToken && token.refresh_token !== currentToken.refresh_token) {
//             req.setHeader("Authorization", "Bearer " + currentToken.access_token);
//         } else {
//             try {
//                 const refresh = await refreshToken(token);
//                 req.setHeader("Authorization", "Bearer " + refresh.access_token);
//             } catch (e) {
//                 if (threadedLock) {
//                     threadedLock.unlock();
//                 }
//                 throw new Errors.TokenRefreshFailedError();
//             }
//         }
//         if (threadedLock) {
//             threadedLock.unlock();
//         }

//         resp = await req.send();
//     }

//     return resp;
// } 
