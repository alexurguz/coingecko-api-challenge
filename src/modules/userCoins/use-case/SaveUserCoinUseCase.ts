import Respository from "../../../domain/Repository";
import UseCase from "../../../domain/UseCase";
import GetUserCoinByUserAndCoinUseCase from './GetUserCoinByUserAndCoinUseCase';
import GetCoinByIdCoingeckoUseCase from '../../cryptoCoins/use-case/GetCoinByIdCoingeckoUseCase';
import UserCoinExistError from '../../../domain/errors/UserCoinExistError';
import UserCoin from '../../../domain/models/UserCoin';

export default class SaveUserCoinUseCase extends UseCase<any> {
    constructor(
        protected repository: Respository<any>,
        private getUserCoinByUserAndCoinUseCase: GetUserCoinByUserAndCoinUseCase,
        private getCoinByIdCoingeckoUseCase: GetCoinByIdCoingeckoUseCase
    ) {
        super(repository);
    }

    /**
     * Insert a user coins into the user_coins collection
     * @author johnurbaguz
     * @date 2021-01-28
     * @param {object} userCoinData - A object of user_coin to register.
     * @returns {Promise<any>}
     * @memberof SaveUserCoinUseCase
     */
    async exec(userCoinData: UserCoin): Promise<any> {
        await this.getCoinByIdCoingeckoUseCase.exec(userCoinData['coinId'] as string);

        const user = await this.getUserCoinByUserAndCoinUseCase.exec(userCoinData);
        if (user) {
            throw new UserCoinExistError(userCoinData.coinId);
        }

        const result = await this.repository.exec(userCoinData);
        return result;
    }
}