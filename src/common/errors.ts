import * as JsonApi from "../jsonapi/index";

export class BadRequestError extends JsonApi.JsonApiError {

}

export class TokenNotAuthorizedError extends JsonApi.JsonApiError {

}

export class TokenRefreshFailedError extends JsonApi.JsonApiError {
    
}

export class ResourceForbiddenError extends JsonApi.JsonApiError {

}

export class FieldValidationError extends JsonApi.JsonApiError {

}

export class ResourceNotFoundError extends JsonApi.JsonApiError {
    
}

export class AuthenticationFailure extends JsonApi.JsonApiError {
    
}

export class ServerError extends JsonApi.JsonApiError {
    
}

export {
    RequestFailedError,
    RequestTimeoutError,
    InvalidMethodError,
    InvalidResponseError
} from "../jsonapi/index";

export function identify(e: JsonApi.JsonApiError): JsonApi.JsonApiError {
    // See if it was a networking issue
    switch (true) {
        case e instanceof JsonApi.RequestFailedError:
        case e instanceof JsonApi.RequestTimeoutError:
        case e instanceof JsonApi.InvalidMethodError:
        case e instanceof JsonApi.InvalidResponseError:
            return e;
        default:
            break;
    }
    
    if (!e.errors || !e.errors.length) {
        return identifyOAuthError(e);
    }
    
    if ("error" in e.errors[0] && "error_description" in e.errors[0]) {
        return identifyOAuthError(e);
    }

    switch (e.errors[0].status) {
        case "400":
            return new BadRequestError();
        case "401":
            return new TokenNotAuthorizedError();
        case "403":
            return new ResourceForbiddenError(e);
        case "404":
            return new ResourceNotFoundError(e);
        case "422":
            return new FieldValidationError(e);
        case "500":
            return new ServerError(e);
        default:
            return e;
    }
}

export class OAuthError extends Error {
    public error: string;
    public error_description: string;
}

function identifyOAuthError(e: JsonApi.JsonApiError): JsonApi.JsonApiError {
    let err: JsonApi.JsonApiError;
    const oauthErr = <OAuthError>e.errors[0];
    
    if (!oauthErr) {
        return new JsonApi.JsonApiError(e);
    }
    
    switch (oauthErr.error) {
        case "access_denied":
            err = new AuthenticationFailure();
            err.name = oauthErr.error;
            err.message = oauthErr.error_description;
            break;
        case "invalid_request":
            err = new BadRequestError();
            err.name = oauthErr.error;
            err.message = oauthErr.error_description;
            break;
        default:
            err = new JsonApi.JsonApiError(e);
    }
    
    return err;
}
