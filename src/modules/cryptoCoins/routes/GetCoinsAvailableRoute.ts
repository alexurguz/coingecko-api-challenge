import Server from '../../../Server';
import * as express from 'express';
import IRoute from '../../../domain/IRoute';
import Database from '../../../datasource/database';
import GetUserByIdMongodb from '../../users/repository/GetUserByIdMongodb';
import GetUserByIdUseCase from '../../users/use-case/GetUserByIdUseCase';
import GetAllCoinsMongo from '../repository/GetAllCoinsMongo';
import GetAllCoinsAvailableUseCase from '../use-case/GetAllCoinsAvailableUseCase';
import * as Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema, createValidator } from 'express-joi-validation';
import * as AuthJWT from "../../../middleware/auth.middleware";
import UserNotAuthorizedError from "../../../domain/errors/UserNotAuthorizedError";
import ApiError from '../../../domain/errors/ApiError';

interface GetCoinsAvailableValidatorRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        limit: number,
        offset: number,
        userId: string
    }
}

export default class GetCoinsAvailableRoute implements IRoute {
    async register(server: Server, database: Database<any>): Promise<any> {
        const getUserByIdMongodbRepository = new GetUserByIdMongodb(database);
        const getUserByIdMongodbUseCase = new GetUserByIdUseCase(getUserByIdMongodbRepository);
        const repository = new GetAllCoinsMongo(database);
        const useCase = new GetAllCoinsAvailableUseCase(repository, getUserByIdMongodbUseCase);
        const validator = createValidator();

        const querySchema = Joi.object({
            limit: Joi.number().required().min(1).max(50).default(20),
            offset: Joi.number().required().min(0).default(0),
            userId: Joi.string().required()
        });

        server.getApp()?.get('/api/v1/coins', AuthJWT.authenticateJWT, validator.query(querySchema),
            async (req: ValidatedRequest<GetCoinsAvailableValidatorRequestSchema>, res: express.Response) => {
            try {
                const { baseUrl, path } = req;
                const { _id } = req.headers.userdata;
                const userId = req.query.userId;

                if( _id != userId ){
                    throw new UserNotAuthorizedError();
                }

                const limit = req.query.limit;
                const offset = req.query.offset;
                const endpointPath = `${baseUrl}${path}`;

                const coins = await useCase.exec(userId, endpointPath, limit, offset);

                return res.status(200).json(coins);
            } catch (error) {
                console.error('GetCoinsAvailableRoute', error);
                if (error instanceof ApiError) {
                    return res.status(error.code).json({ message: error.message });
                }
                return res.json({ success: false, error });
            }
        });
    }
}
