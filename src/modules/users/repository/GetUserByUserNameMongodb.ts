import { Db } from "mongodb";
import Database from "../../../datasource/database";
import { MongoCollection } from "../../../datasource/database/mongo";
import Respository from "../../../domain/Repository";

export default class GetUserByUserNameMongodb extends Respository<Database<Db>> {
    async exec(userName : string): Promise<any> {
        const db = await this.dataSource.getConnection();
        const filter = { userName }
        const result = await db.collection(MongoCollection.USERS).findOne(filter);
        return result;
    }
}
