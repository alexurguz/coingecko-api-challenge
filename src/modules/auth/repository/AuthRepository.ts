import { Db } from "mongodb";
import Database from "../../../datasource/database";
import { MongoCollection } from "../../../datasource/database/mongo";
import Respository from "../../../domain/Repository";

export default class AuthRepository extends Respository<Database<Db>> {
    async exec(authData: any): Promise<any> {
        console.log('AuthRepository::filter data:::',authData);
        let db = await this.dataSource.getConnection();
        const result = await db.collection(MongoCollection.USERS).findOne(authData);
        return result;
    }
}