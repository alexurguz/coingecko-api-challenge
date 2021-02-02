import Server from '../../../Server';
import * as express from 'express';
import * as Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema, createValidator } from 'express-joi-validation';
import IRoute from '../../../domain/IRoute';
import Database from '../../../datasource/database';
import GetUserCoinByUserMongodb from '../repository/GetUserCoinByUserMongodb';
import GetUserCoinByUserUseCase from '../use-case/GetUserCoinByUserUseCase';
import ApiError from '../../../domain/errors/ApiError';
import * as AuthJWT from "../../../middleware/auth.middleware";
import UserNotAuthorizedError from "../../../domain/errors/UserNotAuthorizedError";

interface GetUserByIdValidatorRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        userId: string
    }
}

export default class GetUserCoinByUserRoute implements IRoute {
    async register(server: Server, database: Database<any>): Promise<any> {
        const repository = new GetUserCoinByUserMongodb(database);
        const useCase = new GetUserCoinByUserUseCase(repository);
        const validator = createValidator();

        const querySchema = Joi.object({
            userId: Joi.string().required()
        });

        server.getApp()?.get('/api/v1/usercoin/user/:userId', AuthJWT.authenticateJWT, validator.params(querySchema),
            async (req: ValidatedRequest<GetUserByIdValidatorRequestSchema>, res: express.Response) => {
            try {
                const { _id } = req.headers.userdata;
                const { userId } = req.params;

                if( _id != userId ){
                    throw new UserNotAuthorizedError();
                }

                const userCoins = await useCase.exec(userId);

                return res.status(200).json(userCoins);
            } catch (error) {
                console.error('GetUserCoinByUserRoute', error);
                if (error instanceof ApiError) {
                    return res.status(error.code).json({ message: error.message });
                }
                return res.json({ message: error.message });
            }
        });
    }
}
