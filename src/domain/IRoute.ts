import Server from '../Server';
import Database from '../datasource/database';

export default interface IRoute {
    register(server: Server, database: Database<any>): Promise<any>;
}
