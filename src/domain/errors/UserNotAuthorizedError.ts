import ApiError from "./ApiError";

export default class UserNotAuthorizedError extends ApiError {
    constructor(public cause: Error | null = null) {
        super(`User not authorized for action `, 403, cause);
    }
}
