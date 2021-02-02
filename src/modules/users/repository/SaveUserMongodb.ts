import { Db } from "mongodb";
import Database from "../../../datasource/database";
import { MongoCollection } from "../../../datasource/database/mongo";
import Respository from "../../../domain/Repository";
import User from "../../../domain/models/User";

export default class SaveUserMongodb extends Respository<Database<Db>> {
    async exec(user: User): Promise<any> {
        const db = await this.dataSource.getConnection();
        return (await db.collection(MongoCollection.USERS).insertOne(user)).ops[0];
    }
}
