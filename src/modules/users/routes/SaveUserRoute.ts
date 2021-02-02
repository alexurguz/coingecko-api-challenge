import Server from '../../../Server';
import * as express from 'express';
import * as Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema, createValidator } from 'express-joi-validation';
import IRoute from '../../../domain/IRoute';
import Database from '../../../datasource/database';
import GetUserByUserNameMongodb from '../repository/GetUserByUserNameMongodb';
import GetUserByUserNameUseCase from '../use-case/GetUserByUserNameUseCase';
import SaveUserUseCase from '../use-case/SaveUserUseCase';
import SaveUserMongodb from '../repository/SaveUserMongodb';
import ApiError from '../../../domain/errors/ApiError';
import User from "../../../domain/models/User";
import UserDTO from "../../../domain/dto/UserDTO";
import Utilities from "../../../helpers/Utitlities";

interface UserValidatorRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        name: string,
        lastName: string,
        userName: string,
        password: string,
        favoriteMoney: string
    }
}

export default class SaveUserRoute implements IRoute {
    async register(server: Server, database: Database<any>): Promise<any> {

        const getUserByUserNameMongodbRepository = new GetUserByUserNameMongodb(database);
        const getUserByUserNameUseCase = new GetUserByUserNameUseCase(getUserByUserNameMongodbRepository);
        const saveUserMongodbRepository = new SaveUserMongodb(database);
        const useCase = new SaveUserUseCase( saveUserMongodbRepository, getUserByUserNameUseCase );
        const validator = createValidator();

        const querySchema = Joi.object({
            name: Joi.string().required(),
            lastName: Joi.string().required(),
            userName: Joi.string().required(),
            password: Joi.string().alphanum().min(8).required(),
            favoriteMoney: Joi.string().valid('ars','usd','eur').required()
        });

        server.getApp()?.post('/api/v1/user', validator.body(querySchema),
            async (req: ValidatedRequest<UserValidatorRequestSchema>, res: express.Response) => {
            try {
                const userDTO: UserDTO = req.body as UserDTO; 

                const user: User = new User(userDTO.name, userDTO.lastName,
                    userDTO.userName, Utilities.encryptPassword(userDTO.password),
                    userDTO.favoriteMoney);
                const result = await useCase.exec(user);

                return res.status(200).json(result);
            } catch (error) {
                console.error('SaveUserRoute', error);
                if (error instanceof ApiError) {
                    return res.status(error.code).json({ message: error.message });
                }
                return res.status(200).json({ message: error.message });
            }
        });
    }
}
