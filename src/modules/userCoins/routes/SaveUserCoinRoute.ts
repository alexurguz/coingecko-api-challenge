import LoadEnv from '../../../helpers/LoadEnv';
import Server from '../../../Server';
import * as express from 'express';
import AxiosRequestClient from '../../../datasource/rest-api/AxiosRequestClient';
import Api from '../../../datasource/rest-api/Api';
import * as Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema, createValidator } from 'express-joi-validation';
import IRoute from '../../../domain/IRoute';
import Database from '../../../datasource/database';
import GetUserCoinByUserAndCoinMongodb from '../repository/GetUserCoinByUserAndCoinMongodb';
import GetUserCoinByUserAndCoinUseCase from '../use-case/GetUserCoinByUserAndCoinUseCase';
import SaveUserCoinUseCase from '../use-case/SaveUserCoinUseCase';
import SaveUserCoinMongodb from '../repository/SaveUserCoinMongodb';
import GetCoinByIdCoingecko from '../../cryptoCoins/repository/GetCoinByIdCoingecko';
import GetCoinByIdCoingeckoUseCase from '../../cryptoCoins/use-case/GetCoinByIdCoingeckoUseCase';
import ApiError from '../../../domain/errors/ApiError';
import UserCoinDTO from '../../../domain/dto/UserCoinDTO';
import UserCoin from '../../../domain/models/UserCoin';
import * as AuthJWT from "../../../middleware/auth.middleware";
import UserNotAuthorizedError from "../../../domain/errors/UserNotAuthorizedError";

interface UserCoinValidatorRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        userId: string,
        coinId: string
    }
}

export default class SaveUserCoinRoute implements IRoute {
    async register(server: Server, database: Database<any>): Promise<any> {
        const api = new Api(new AxiosRequestClient());
        const getCoinByIdCoingeckoRepository = new GetCoinByIdCoingecko(api);
        const getCoinByIdCoingeckoUseCase = new GetCoinByIdCoingeckoUseCase(getCoinByIdCoingeckoRepository);
        const getUserCoinByUserAndCoinMongodbRepository = new GetUserCoinByUserAndCoinMongodb(database);
        const getUserCoinByUserAndCoinUseCase = new GetUserCoinByUserAndCoinUseCase(getUserCoinByUserAndCoinMongodbRepository);
        const saveUserCoinRepository = new SaveUserCoinMongodb(database);
        const saveUserCoinUseCase = new SaveUserCoinUseCase( saveUserCoinRepository, 
            getUserCoinByUserAndCoinUseCase, getCoinByIdCoingeckoUseCase );
        const validator = createValidator();

        const querySchema = Joi.object({
            userId: Joi.string().required(),
            coinId: Joi.string().required()
        });

        server.getApp()?.post('/api/v1/usercoin', AuthJWT.authenticateJWT, validator.body(querySchema),
            async (req: ValidatedRequest<UserCoinValidatorRequestSchema>, res: express.Response) => {
            try {

                const { _id } = req.headers.userdata;
                const userCoinDTO: UserCoinDTO = req.body as UserCoinDTO; 

                if( _id != userCoinDTO.userId ){
                    throw new UserNotAuthorizedError();
                }

                const userCoin: UserCoin = new UserCoin(userCoinDTO.userId, userCoinDTO.coinId);
                const result = await saveUserCoinUseCase.exec(userCoin);

                return res.status(200).json(result);
            } catch (error) {
                console.error('SaveUserCoinRoute', error);
                if (error instanceof ApiError) {
                    return res.status(error.code).json({ message: error.message });
                }
                return res.status(200).json({ message: error.message });
            }
        });
    }
}
