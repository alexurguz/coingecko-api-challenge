import { Db, ObjectID } from "mongodb";
import Database from "../../../datasource/database";
import { MongoCollection } from "../../../datasource/database/mongo";
import Respository from "../../../domain/Repository";

export default class GetUserByIdMongodb extends Respository<Database<Db>> {
    async exec(id : string): Promise<any> {
        let db = await this.dataSource.getConnection();
        const _id = new ObjectID(id);
        const filter = { _id }
        const result = await db.collection(MongoCollection.USERS).findOne(filter);
        return result;
    }
}
