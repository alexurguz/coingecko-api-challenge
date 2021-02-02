import UseCase from "../../../domain/UseCase";
import CoinsNotFoundError from "../../../domain/errors/CoinsNotFoundError";

export default class GetUserCoinByUserUseCase extends UseCase<any> {

    async exec(userId: string): Promise<any> {
        const userCoins = await this.repository.exec(userId);

        if (!userCoins || userCoins.length == 0) {
            throw new CoinsNotFoundError();
        }

        return userCoins;
    }
}
