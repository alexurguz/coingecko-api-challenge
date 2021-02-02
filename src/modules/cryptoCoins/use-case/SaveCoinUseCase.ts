import UseCase from "../../../domain/UseCase";
import User from "../../../domain/models/User";
import UserNameExistError from '../../../domain/errors/UserNameExistError';

export default class SaveCoinUseCase extends UseCase<any> {

    /**
     * Insert a coin into the coin collection
     * @author johnurbaguz
     * @date 2021-01-30
     * @param {object} userData - A object of user to register.
     * @returns {Promise<any>}
     * @memberof SaveCoinUseCase
     */
    async exec(coin: any): Promise<any> {
        const result = await this.repository.exec(coin);
        return result;
    }
}