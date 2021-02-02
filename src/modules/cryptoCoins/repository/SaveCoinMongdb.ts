import { Db } from "mongodb";
import Database from "../../../datasource/database";
import { MongoCollection } from "../../../datasource/database/mongo";
import Respository from "../../../domain/Repository";

export default class SaveCoinMongdb extends Respository<Database<Db>> {
    async exec(coin: any): Promise<any> {
        const db = await this.dataSource.getConnection();
        console.log('Inserting::SaveCoinMongdb::exec::coin::',coin);
        return (await db.collection(MongoCollection.COINS).insertOne(coin)).ops[0];
    }
}
