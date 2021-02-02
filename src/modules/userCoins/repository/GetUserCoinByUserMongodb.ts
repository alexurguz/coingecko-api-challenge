import { Db } from "mongodb";
import Database from "../../../datasource/database";
import { MongoCollection } from "../../../datasource/database/mongo";
import Respository from "../../../domain/Repository";
import UserCoin from '../../../domain/models/UserCoin';

export default class GetUserCoinByUserMongodb extends Respository<Database<Db>> {
    async exec(userId: string): Promise<any> {
        const db = await this.dataSource.getConnection();
        const filter = { userId };
        let userCoins = Array<UserCoin>();
        userCoins = await db.collection(MongoCollection.USER_COINS)
            .find(filter)
            .toArray();
        return userCoins;
    }
}
