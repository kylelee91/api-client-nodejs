import * as JsonApi from "../jsonapi/index";
import * as Errors from "../common/errors";
import Settings from "../common/settings";
import { getStorage } from "./storage";
import Client from "./client";
import Token from "./token";

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
        req.options = options;
        req.options["grant_type"] = "password";
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
        req.options = {
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
    let lock: Promise<Token> | undefined;

    return async (t: Token) => {
        try {
            if (lock) {
                console.log("Waiting on previous call to refresh to resolve.");                
                return await lock;
            }

            console.log("Initiating Token Refresh.");                
            const req = new JsonApi.Request<Token>(Settings.auth.refreshUrl);
            req.method = "get";
            req.options = {
                "grant_type": "refresh_token",
                "refresh_token": t.refresh_token
            };

            if (Client.id && Client.secret) {
                req.options["client_id"] = Client.id;
                req.options["client_secret"] = Client.secret;
            }

            lock = req.send();
            const token = await lock;
            console.log("Token retreived: ", token);                
            getStorage().write(token);
            lock = undefined; // Don't forget to do this otherwise second refresh attempt fails.
            return token;
        } catch (e) {
            throw Errors.identify(e);
        }
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

        console.error("Issue loading request: ", e);
        if ((eType instanceof Errors.TokenNotAuthorizedError) === false) {
            throw eType;
        }

        console.log("Attempting to refresh token");

        // Handles the following case:
        // 1) Token expires with failed request
        // 2) Another request with expired token is made
        // 3) Refresh token request initiated and completes (unlocking this function)
        // 4) Expired token request completes, tries to do refresh with old token and fails
        const currentToken = readToken();
        console.log("Current Token: ", currentToken);
        if (currentToken && token.refresh_token !== currentToken.refresh_token) {
            console.log("Token mismatch, must have already refreshed. Loading from cache.");
            req.setHeader("Authorization", "Bearer " + currentToken.access_token);
        } else {
            try {
                console.log("Contacting refresh server.");
                const refresh = await refreshToken(token);
                req.setHeader("Authorization", "Bearer " + refresh.access_token);
                console.log("Signed request with new token ", refresh);
            } catch (e) {
                console.error("Error refreshing token: ", e);
                throw new Errors.TokenRefreshFailedError();
            }
        }

        console.log("Retrying request");
        resp = await req.send();
        console.log("Request sent successfully");
    }

    return resp;
} 
