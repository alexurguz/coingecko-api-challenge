import { AxiosError } from "axios";
import ApiError from "./ApiError";

export default class CoingeckoRequestError extends ApiError {
    constructor(cause: AxiosError | null = null) {
        super(`Coingecko - ${cause?.message}`, cause?.response?.status || 500, cause);
    }
}
