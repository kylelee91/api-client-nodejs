import * as JsonApi from "../jsonapi/index";
import * as Errors from "../common/errors";
import Settings from "../common/settings";
import { getStorage } from "./storage";
import Client from "./client";
import Token from "./token";
import ThreadedLock from "threaded-lock";

export async function passwordAuth(options: {
    username: string,
    client_id?: string,
    client_secret?: string
    password: string,
}): Promise<Token> {
    try {
        const req = new JsonApi.Request<Token>(Settings.auth.tokenUrl);
        if (options.client_id && options.client_secret) {
            Client.id = options.client_id;
            Client.secret = options.client_secret;
        }
        req.method = "post";
        req.query = options;
        req.query["grant_type"] = "password";
        const token = await req.send();
        getStorage().write(token);
        return token;
    } catch (e) {
        throw Errors.identify(e);
    }
}

export async function apiKeyAuth(k: string): Promise<Token> {
    try {
        const req = new JsonApi.Request<Token>(Settings.auth.tokenUrl);
        req.method = "post";
        req.query = {
            grant_type: "apikey",
            key: k
        };
        const token = await req.send();
        getStorage().write(token);
        return token;
    } catch (e) {
        throw Errors.identify(e);
    }
}

export async function deleteToken() {
    getStorage().delete();
}

export function readToken(): Token {
    const t = getStorage().read();
    if (!t) {
        throw new Errors.TokenNotAuthorizedError();
    }

    return t;
}

// Allow lock var to persist.
// Acts as mutex, only one refresh will happen.
export let refreshToken: (t: Token) => Promise<Token> = (() => {
    return async (t: Token): Promise<Token> => {
        const req = new JsonApi.Request<Token>(Settings.auth.refreshUrl);
        req.method = "get";
        req.query = {
            "grant_type": "refresh_token",
            "refresh_token": t.refresh_token
        };
        if (Client.id && Client.secret) {
            req.query["client_id"] = Client.id;
            req.query["client_secret"] = Client.secret;
        }
        const token = await req.send();
        getStorage().write(new Token(token));
        return token;
    };
})();

export async function signRequest<T>(req: JsonApi.Request<T>): Promise<T> {
    const token = readToken();
    let resp: T;
    req.setHeader("Authorization", "Bearer " + token.access_token);

    try {
        resp = await req.send();
    } catch (e) {
        const eType = Errors.identify(e);

        if ((eType instanceof Errors.TokenNotAuthorizedError) === false) {
            throw eType;
        }

        // Handles the following case:
        // 1) Token expires with failed request
        // 2) Another request with expired token is made
        // 3) Refresh token request initiated and completes (unlocking this function)
        // 4) Expired token request completes, tries to do refresh with old token and fails
        let threadedLock: ThreadedLock | undefined;
        if (window && window.localStorage) {
            threadedLock = new ThreadedLock("refresh_lock");
            await threadedLock.lock();
        }
        getStorage().clearCache();
        const currentToken = readToken();
        if (currentToken && token.refresh_token !== currentToken.refresh_token) {
            req.setHeader("Authorization", "Bearer " + currentToken.access_token);
        } else {
            try {
                const refresh = await refreshToken(token);
                req.setHeader("Authorization", "Bearer " + refresh.access_token);
            } catch (e) {
                if (threadedLock) {
                    threadedLock.unlock();
                }
                throw new Errors.TokenRefreshFailedError();
            }
        }
        if (threadedLock) {
            threadedLock.unlock();
        }

        resp = await req.send();
    }

    return resp;
} 
