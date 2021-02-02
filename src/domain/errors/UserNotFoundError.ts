import ApiError from "./ApiError";

export default class UserNotFoundError extends ApiError {
    constructor(public cause: Error | null = null) {
        super(`User not found `, 400, cause);
    }
}
