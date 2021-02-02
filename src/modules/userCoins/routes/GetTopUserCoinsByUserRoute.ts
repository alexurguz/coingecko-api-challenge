import Server from '../../../Server';
import * as express from 'express';
import IRoute from '../../../domain/IRoute';
import Database from '../../../datasource/database';
import AxiosRequestClient from '../../../datasource/rest-api/AxiosRequestClient';
import Api from '../../../datasource/rest-api/Api';
import * as Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema, createValidator } from 'express-joi-validation';
import UpdateUserCoinMongodb from '../repository/UpdateUserCoinMongodb';
import UpdateUserCoinUseCase from '../use-case/UpdateUserCoinUseCase';
import GetUserCoinByUserMongodb from '../repository/GetUserCoinByUserMongodb';
import GetUserCoinByUserUseCase from '../use-case/GetUserCoinByUserUseCase';
import GetCoinByIdCoingecko from '../../cryptoCoins/repository/GetCoinByIdCoingecko';
import GetCoinByIdCoingeckoUseCase from '../../cryptoCoins/use-case/GetCoinByIdCoingeckoUseCase';
import GetUserByIdMongodb from '../../users/repository/GetUserByIdMongodb';
import GetUserByIdUseCase from '../../users/use-case/GetUserByIdUseCase';
import GetTopUserCoinsByUserMongodbRepository from '../repository/GetTopUserCoinsByUserMongodb';
import GetTopUserCoinsByUserUseCase from '../use-case/GetTopUserCoinsByUserUseCase';
import ApiError from '../../../domain/errors/ApiError';
import * as AuthJWT from "../../../middleware/auth.middleware";
import UserNotAuthorizedError from "../../../domain/errors/UserNotAuthorizedError";

interface UserCoinTopValidatorRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        userId: string,
        order: string,
        limit: number
    }
}

export default class GetTopUserCoinsByUserRoute implements IRoute {
    async register(server: Server, database: Database<any>): Promise<any> {
        const api = new Api(new AxiosRequestClient());
        const updateUserCoinMongodb = new UpdateUserCoinMongodb(database);
        const updateUserCoinUseCase = new UpdateUserCoinUseCase(updateUserCoinMongodb);
        const getCoinByIdCoingeckoRepository = new GetCoinByIdCoingecko(api);
        const getCoinByIdCoingeckoUseCase = new GetCoinByIdCoingeckoUseCase(getCoinByIdCoingeckoRepository);
        const getUserCoinByUserMongodbRepository = new GetUserCoinByUserMongodb(database);
        const getUserCoinByUserUseCase = new GetUserCoinByUserUseCase(getUserCoinByUserMongodbRepository);
        const getUserByIdMongodbRepository = new GetUserByIdMongodb(database);
        const getUserByIdMongodbUseCase = new GetUserByIdUseCase(getUserByIdMongodbRepository);
        const getTopUserCoinsByUserMongodbRepository = new GetTopUserCoinsByUserMongodbRepository(database);
        const useCase = new GetTopUserCoinsByUserUseCase(getTopUserCoinsByUserMongodbRepository, 
            getCoinByIdCoingeckoUseCase, updateUserCoinUseCase, getUserCoinByUserUseCase, getUserByIdMongodbUseCase);
        const validator = createValidator();

        const querySchema = Joi.object({
            userId: Joi.string().required(),
            order: Joi.string().valid('asc','desc').default('desc'),
            limit: Joi.number().min(1).max(25).required()
        });

        server.getApp()?.post('/api/v1/usercoin/top', AuthJWT.authenticateJWT, validator.body(querySchema),
            async (req: ValidatedRequest<UserCoinTopValidatorRequestSchema>, res: express.Response) => {
            try {
                const { _id } = req.headers.userdata;
                const userCoinTop = req.body; 

                if( _id != userCoinTop.userId ){
                    throw new UserNotAuthorizedError();
                }
                const result = await useCase.exec(userCoinTop);

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