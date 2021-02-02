import { Db } from "mongodb";
import Database from "../../../datasource/database";
import { MongoCollection } from "../../../datasource/database/mongo";
import Respository from "../../../domain/Repository";
import UserCoin from '../../../domain/models/UserCoin';

export default class UpdateUserCoinMongodb extends Respository<Database<Db>> {
    async exec(userCoins: Array<UserCoin>, userId: string): Promise<any> {
        const db = await this.dataSource.getConnection();
        const filter = { userId }
        await db.collection(MongoCollection.USER_COINS).deleteMany(filter);
        const result = (await db.collection(MongoCollection.USER_COINS).insertMany(userCoins));
        return result;
    }
}
