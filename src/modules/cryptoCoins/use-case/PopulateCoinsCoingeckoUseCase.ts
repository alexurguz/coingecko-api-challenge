import * as Bluebird from 'bluebird';
import Respository from "../../../domain/Repository";
import UseCase from "../../../domain/UseCase";
import DeleteAllCoinsUseCase from './DeleteAllCoinsUseCase';
import SaveCoinUseCase from './SaveCoinUseCase';
import GetCoinByIdCoingeckoUseCase from './GetCoinByIdCoingeckoUseCase';
import GetUserByIdUseCase from '../../users/use-case/GetUserByIdUseCase';
import Constants from '../../../helpers/Constants';
import UserNotFoundError from '../../../domain/errors/UserNotFoundError';
import CoinsNotFoundError from '../../../domain/errors/CoinsNotFoundError';
import User from '../../../domain/models/User';

export default class PopulateCoinsCoingeckoUseCase extends UseCase<any> {
    constructor(
        protected repository: Respository<any>,
        private deleteAllCoinsUseCase: DeleteAllCoinsUseCase,
        private saveCoinUseCase: SaveCoinUseCase,
        private getCoinByIdCoingeckoUseCase: GetCoinByIdCoingeckoUseCase,
        private getUserByIdUseCase: GetUserByIdUseCase
    ) {
        super(repository);
    }

    /**
     * Get the coins with the money type selected by the user
     * @author johnurbaguz
     * @date 2021-01-28
     * @param {string} userId - Id user to get quote currency.
     * @param {boolean} preview - Allow see some rows to validate structure.
     * @returns {Promise<Array<string>>}
     * @memberof GetAllCoinsCoingeckoUseCase
     */
    async exec(userId: string): Promise<Array<string>> {

        const user: User = await this.getUserByIdUseCase.exec(userId);

        if (!user) {
            throw new UserNotFoundError();
        }

        let coins = Array<any>();
        coins = await this.repository.exec();

        if (coins.length == 0) {
            throw new CoinsNotFoundError();
        }

        await this.deleteAllCoinsUseCase.exec();

        const coinsAvailables = await Bluebird.map( coins, async (coin) => {
            const coinData: any = await this.getCoinByIdCoingeckoUseCase.exec(coin['id']);
            await Bluebird.delay(Constants.POPULATE_COINS.DELAY);
            delete coin['id'];
            coin.price = {
                ars: coinData['market_data']['current_price'][Constants.QUOTE_CURRENCY_ALLOWED[0]],
                usd: coinData['market_data']['current_price'][Constants.QUOTE_CURRENCY_ALLOWED[1]],
                eur: coinData['market_data']['current_price'][Constants.QUOTE_CURRENCY_ALLOWED[2]],
            },
            coin.image = coinData['image'];
            coin.lastUpdateDate = coinData['last_updated'];
            await this.saveCoinUseCase.exec(coin);
            return coin;
        }, { concurrency: Constants.POPULATE_COINS.CONCURRENCY });

        return coinsAvailables;
    }
}
