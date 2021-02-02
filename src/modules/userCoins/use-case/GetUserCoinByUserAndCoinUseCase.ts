import UseCase from "../../../domain/UseCase";
import UserCoin from '../../../domain/models/UserCoin';

export default class GetUserCoinByUserAndCoinUseCase extends UseCase<any> {
    async exec(userCoinData: UserCoin): Promise<any> {
        const userCoin = await this.repository.exec(userCoinData);
        return userCoin;
    }
}
