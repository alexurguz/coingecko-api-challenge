import Server from '../../../Server';
import * as express from 'express';
import ApiError from '../../../domain/errors/ApiError';
import IRoute from '../../../domain/IRoute';
import Database from '../../../datasource/database';
import AxiosRequestClient from '../../../datasource/rest-api/AxiosRequestClient';
import Api from '../../../datasource/rest-api/Api';
import * as Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema, createValidator } from 'express-joi-validation';
import GetAllCoinsCoingecko from '../repository/GetAllCoinsCoingecko';
import PopulateCoinsCoingeckoUseCase from '../use-case/PopulateCoinsCoingeckoUseCase';
import GetCoinByIdCoingecko from '../repository/GetCoinByIdCoingecko';
import GetCoinByIdCoingeckoUseCase from '../use-case/GetCoinByIdCoingeckoUseCase';
import GetUserByIdMongodb from '../../users/repository/GetUserByIdMongodb';
import GetUserByIdUseCase from '../../users/use-case/GetUserByIdUseCase';
import DeleteAllCoinsMongdb from '../repository/DeleteAllCoinsMongdb';
import DeleteAllCoinsUseCase from '../use-case/DeleteAllCoinsUseCase';
import SaveCoinMongdb from '../repository/SaveCoinMongdb';
import SaveCoinUseCase from '../use-case/SaveCoinUseCase';
import * as AuthJWT from "../../../middleware/auth.middleware";
import UserNotAuthorizedError from "../../../domain/errors/UserNotAuthorizedError";


interface PopulateCoinsAvailableValidatorRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Params]: {
        userId: string
    }
}

export default class PopulateCoinsAvailableRoute implements IRoute {
    async register(server: Server, database: Database<any>): Promise<any> {
        const api = new Api(new AxiosRequestClient());
        const saveCoinMongdb = new SaveCoinMongdb(database);
        const saveCoinUseCase = new SaveCoinUseCase(saveCoinMongdb);
        const deleteAllCoinsMongdb = new DeleteAllCoinsMongdb(database);
        const deleteAllCoinsUseCase = new DeleteAllCoinsUseCase(deleteAllCoinsMongdb);
        const getUserByIdMongodbRepository = new GetUserByIdMongodb(database);
        const getUserByIdMongodbUseCase = new GetUserByIdUseCase(getUserByIdMongodbRepository);
        const getCoinByIdCoingeckoRepository = new GetCoinByIdCoingecko(api);
        const getCoinByIdCoingeckoUseCase = new GetCoinByIdCoingeckoUseCase(getCoinByIdCoingeckoRepository);
        const getAllCoinsCoingeckoRepository = new GetAllCoinsCoingecko(api);
        const populateCoinsCoingeckoUseCase = new PopulateCoinsCoingeckoUseCase(getAllCoinsCoingeckoRepository,
            deleteAllCoinsUseCase, saveCoinUseCase, getCoinByIdCoingeckoUseCase, getUserByIdMongodbUseCase);
        const validator = createValidator();

        const querySchema = Joi.object({
            userId: Joi.string().required()
        });

        server.getApp()?.get('/api/v1/coins/populate/:userId', AuthJWT.authenticateJWT, validator.params(querySchema),
            async (req: ValidatedRequest<PopulateCoinsAvailableValidatorRequestSchema> , res: express.Response) => {
            try {
                const { _id } = req.headers.userdata;
                const { userId } = req.params;

                if( _id != userId ){
                    throw new UserNotAuthorizedError();
                }

                const coins = await populateCoinsCoingeckoUseCase.exec(userId);

                return res.status(200).json(coins);
            } catch (error) {
                console.error('PopulateCoinsAvailableRoute', error);
                if (error instanceof ApiError) {
                    return res.status(error.code).json({ message: error.message });
                }
                return res.json({ success: false, error });
            }
        });
    }
}
