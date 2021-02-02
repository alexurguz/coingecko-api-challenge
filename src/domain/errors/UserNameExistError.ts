import ApiError from "./ApiError";

export default class UserNameExistError extends ApiError {
    constructor(userName: string, cause: Error | null = null) {
        super(`Username already exist ${userName}`, 400, cause);
    }
}
