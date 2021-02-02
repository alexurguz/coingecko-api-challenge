import UseCase from "../../../domain/UseCase";
import Respository from "../../../domain/Repository";
import GetUserByIdUseCase from '../../users/use-case/GetUserByIdUseCase';
import UserNotFoundError from '../../../domain/errors/UserNotFoundError';
import CoinsNotFoundError from '../../../domain/errors/CoinsNotFoundError';
import User from '../../../domain/models/User';

export default class GetSongsUseCase extends UseCase<any> {

    constructor(
        protected repository: Respository<any>,
        private getUserByIdUseCase: GetUserByIdUseCase
    ) {
        super(repository);
    }

    async exec(
        userId: string, endpointPath: string,
        limit: number, offset: number
    ): Promise<any> {

        const user: User = await this.getUserByIdUseCase.exec(userId);

        if (!user) {
            throw new UserNotFoundError();
        }

        const { rows, count } = await this.repository.exec(limit, offset);

        if(rows.length == 0){
            throw new CoinsNotFoundError();
        }

        const coins = rows.map((coin: any) => {
            const price = {
                currency: user.favoriteMoney,
                quote: coin.price[user.favoriteMoney]
            }
            coin.price = price;
            return coin;
        });

        const paging = this.getPagingData( endpointPath, count, limit, offset);

        return { coins, limit, offset, ...paging };
    }

    private getPagingData(
        endpointPath: string, total: number,
        limit: number, offset: number
    ): any {
        const nextOffset = Math.min(total, offset + limit);
        const previousOffset = offset - limit;
        let next = null;
        let previous = null;

        if (nextOffset < total) {
            next = `${endpointPath}?offset=${nextOffset}&limit=${limit}`;
        }
        if (previousOffset >= 0) {
            previous = `${endpointPath}?offset=${previousOffset}&limit=${limit}`;
        }

        return { total, next, previous };
    }
}
