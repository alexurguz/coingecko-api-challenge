import { Methods } from "../../../datasource/rest-api/Client";
import Api from "../../../datasource/rest-api/Api";
import Respository from "../../../domain/Repository";
import CoingeckoRequestError from "../../../domain/errors/CoingeckoRequestError";

export default class GetCoinByIdCoingecko extends Respository<Api> {
    private static URL: string = 'https://api.coingecko.com/api/v3/coins/{coinId}?tickers=false&community_data=false&developer_data=false&sparkline=false';

    async exec( coinId: string ): Promise<any> {
        try {
            const response = await this.dataSource.request({
                url: GetCoinByIdCoingecko.URL,
                method: Methods.GET
            }, { coinId });

            return response.data;
        } catch(error) {
            throw new CoingeckoRequestError(error);
        }
    }
}
