import { Db } from "mongodb";
import Database from "../../../datasource/database";
import { MongoCollection } from "../../../datasource/database/mongo";
import Respository from "../../../domain/Repository";
import UserCoin from '../../../domain/models/UserCoin';

export default class GetTopUserCoinsByUserMongodb extends Respository<Database<Db>> {
    async exec(userId: string, order: number, userQuote: string, limit: number): Promise<any> {
        const db = await this.dataSource.getConnection();
        const filter = { userId };
        const projection = { _id: 0, userId:0, coinId: 0 };
        let userCoins = Array<UserCoin>();
        const userCoinsOrder = JSON.parse(`{"${userQuote}": ${order}}`);
        userCoins = await db.collection(MongoCollection.USER_COINS)
            .find(filter)
            .sort(userCoinsOrder)
            .limit(limit)
            .project(projection)
            .toArray();
        return userCoins;
    }
}
