import Respository from "../../../domain/Repository";
import UseCase from "../../../domain/UseCase";

export default class UpdateUserCoinUseCase extends UseCase<any> {
    constructor(
        protected repository: Respository<any>
    ) {
        super(repository);
    }

    /**
     * Update a user coins into user_coin collection
     * @author johnurbaguz
     * @date 2021-01-31
     * @param {object} userCoinsData - A array object of user coins to update.
     * @returns {Promise<any>}
     * @memberof UpdateUserCoinUseCase
     */
    async exec(userCoinsData : Array<object>, userId: string): Promise<any> {
        console.log('entro al update:::');

        return await this.repository.exec(userCoinsData, userId);
    }
}
