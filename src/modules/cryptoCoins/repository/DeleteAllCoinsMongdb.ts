import { Db } from "mongodb";
import Database from "../../../datasource/database";
import { MongoCollection } from "../../../datasource/database/mongo";
import Respository from "../../../domain/Repository";

export default class DeleteAllCoinsMongdb extends Respository<Database<Db>> {
    async exec(): Promise<any> {
        const db = await this.dataSource.getConnection();
        return await db.collection(MongoCollection.COINS).deleteMany({});
    }
}