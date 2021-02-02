import { Db } from "mongodb";
import Database from "../../../datasource/database";
import { MongoCollection } from "../../../datasource/database/mongo";
import Respository from "../../../domain/Repository";
import Constants from "../../../helpers/Constants";

export default class SaveSongsMongodb extends Respository<Database<Db>> {
    async exec(
        limit: number = Constants.MY_API_PAGING.DEFAULT_LIMIT,
        offset: number = Constants.MY_API_PAGING.DEFAULT_OFFSET
    ): Promise<any> {
        const db = await this.dataSource.getConnection();

        const projection = { _id: 0 };
        const pagination = { skip: offset, limit: limit };

        const rows = await db.collection(MongoCollection.COINS)
            .find({}, { projection, ...pagination })
            .toArray();
        const count = await db.collection(MongoCollection.COINS)
            .countDocuments({});

        return { rows, count };
    }
}
