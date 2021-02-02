import UseCase from "../../../domain/UseCase";
import Respository from "../../../domain/Repository";
import * as Bluebird from 'bluebird';
import UserCoin from '../../../domain/models/UserCoin';
import Constants from '../../../helpers/Constants';
import User from '../../../domain/models/User';
import GetCoinByIdCoingeckoUseCase from '../../cryptoCoins/use-case/GetCoinByIdCoingeckoUseCase';
import GetUserByIdUseCase from '../../users/use-case/GetUserByIdUseCase';
import UpdateUserCoinsUseCase from './UpdateUserCoinUseCase';
import GetUserCoinByUserUseCase from './GetUserCoinByUserUseCase';
import CoinsNotFoundError from "../../../domain/errors/CoinsNotFoundError";
import UserNotFoundError from "../../../domain/errors/UserNotFoundError";

export default class GetTopUserCoinsByUserUseCase extends UseCase<any> {

    constructor(
        protected repository: Respository<any>,
        private getCoinByIdCoingeckoUseCase: GetCoinByIdCoingeckoUseCase,
        private updateUserCoinsUseCase: UpdateUserCoinsUseCase,
        private getUserCoinByUserUseCase: GetUserCoinByUserUseCase,
        private getUserByIdUseCase: GetUserByIdUseCase
    ) {
        super(repository);
    }

    async exec(userCoinTop: any): Promise<any> {
        console.log('GetTopUserCoinsByUserUseCase::exec::userId', userCoinTop.userId);
        console.log('GetTopUserCoinsByUserUseCase::exec::order**::', userCoinTop.order);
        console.log('GetTopUserCoinsByUserUseCase::exec::limit', userCoinTop.limit);
        const user: User = await this.getUserByIdUseCase.exec(userCoinTop.userId);
        console.log('GetTopUserCoinsByUserUseCase::exec::user', user);
        if (!user) {
            throw new UserNotFoundError();
        }

        const userCoins = await this.getUserCoinByUserUseCase.exec(userCoinTop.userId);

        if (!userCoins) {
            throw new CoinsNotFoundError();
        }
        const userQuote = user.favoriteMoney;
        let userCoinsResult = await Bluebird.map( userCoins, async (userCoin: UserCoin) => {
            const coinCoingeckoData: any = await this.getCoinByIdCoingeckoUseCase.exec(userCoin.coinId);
            await Bluebird.delay(Constants.POPULATE_COINS.DELAY);
            const {ars, eur, usd} = coinCoingeckoData['market_data']['current_price'];
            const coin = {
                userId: userCoin.userId,
                coinId: userCoin.coinId,
                symbol: coinCoingeckoData['symbol'],
                ars,
                eur,
                usd,
                name: coinCoingeckoData['name'],
                image: coinCoingeckoData['image'],
                lastUpdateDate: coinCoingeckoData['last_updated']
            }

            return coin;
        }, { concurrency: Constants.POPULATE_COINS.CONCURRENCY });
        await this.updateUserCoinsUseCase.exec(userCoinsResult, userCoinTop.userId);

        const TopUserCoins = await this.repository.exec(userCoinTop.userId, Constants.ORDER_BY[userCoinTop.order], userQuote, userCoinTop.limit);

        return TopUserCoins;
    }
}
