import { Db } from "mongodb";
import Database from "../../../datasource/database";
import { MongoCollection } from "../../../datasource/database/mongo";
import Respository from "../../../domain/Repository";

export default class SaveUserCoinMongodb extends Respository<Database<Db>> {
    async exec(userCoin: any): Promise<any> {
        const db = await this.dataSource.getConnection();
        const result = (await db.collection(MongoCollection.USER_COINS).insertOne(userCoin)).ops[0];
        return result;
    }
}
