import { Db } from "mongodb";
import Database from "../../../datasource/database";
import { MongoCollection } from "../../../datasource/database/mongo";
import Respository from "../../../domain/Repository";
import UserCoin from '../../../domain/models/UserCoin';

export default class GetUserCoinByUserAndCoinMongodb extends Respository<Database<Db>> {
    async exec(userCoinData: UserCoin): Promise<any> {
        const db = await this.dataSource.getConnection();
        const result = await db.collection(MongoCollection.USER_COINS).findOne(userCoinData);
        return result;
    }
}
