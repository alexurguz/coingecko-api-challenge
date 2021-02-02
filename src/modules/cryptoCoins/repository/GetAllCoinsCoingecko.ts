import { Methods } from "../../../datasource/rest-api/Client";
import Api from "../../../datasource/rest-api/Api";
import Respository from "../../../domain/Repository";
import CoingeckoRequestError from "../../../domain/errors/CoingeckoRequestError";

export default class GetAllCoinsCoingecko extends Respository<Api> {
    private static URL: string = 'https://api.coingecko.com/api/v3/coins/list';

    async exec(): Promise<any> {
        try {
            const response = await this.dataSource.request({
                url: GetAllCoinsCoingecko.URL,
                method: Methods.GET
            });

            return response.data;
        } catch(error) {
            throw new CoingeckoRequestError(error);
        }
    }
}
