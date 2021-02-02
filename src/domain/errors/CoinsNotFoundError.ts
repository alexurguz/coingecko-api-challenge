import ApiError from "./ApiError";

export default class CoinsNotFoundError extends ApiError {
    constructor(public cause: Error | null = null) {
        super(`Coins not found `, 400, cause);
    }
}
