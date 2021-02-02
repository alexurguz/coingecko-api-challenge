import LoadEnv from './helpers/LoadEnv';
import * as express from 'express';
import Database from './datasource/database';
import Router from './Router';

export default class Server {
    private _instance: express.Application | null = null;
    private _router: express.Router | null = null;

    constructor(private database: Database<any>) {}

    public async start() {
        this._instance = express();

        let bodyParser = require('body-parser');
        this._instance.use( bodyParser.json() );
        this._instance.use(bodyParser.urlencoded({ extended: true }));

        this._router = express.Router();

        this._instance.listen(LoadEnv.PORT);
        this.setupLogger();

        await Router.loadRoutes(this, this.database);
        await this.database.connect();
        console.log(`Server running on http://localhost:${LoadEnv.PORT}`);
    };

    public getApp(): express.Application | null {
        return this._instance;
    }

    public getRouter(): express.Router | null {
        return this._router;
    }

    public async stop() {
        // this._instance?.
    }

    private setupLogger() {
        this._instance?.route('/')
            .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
                // this middleware function runs before any request to /users/:userId
                // but it doesn't accomplish anything just yet---
                // it simply passes control to the next applicable function below using next()
                const href = req.url;
                console.debug(`Request ${req.method.toUpperCase()} > ${href}`);
                next();
            });
    }
}
