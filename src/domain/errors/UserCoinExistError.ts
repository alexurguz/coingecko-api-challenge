import ApiError from "./ApiError";

export default class UserCoinExistError extends ApiError {
    constructor(coinId: string, cause: Error | null = null) {
        super(`Usercoin already exist ${coinId}`, 400, cause);
    }
}
