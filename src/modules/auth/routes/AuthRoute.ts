import LoadEnv from './../../../helpers/LoadEnv';
import Server from '../../../Server';
import * as express from 'express';
import * as Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema, createValidator } from 'express-joi-validation';
import IRoute from '../../../domain/IRoute';
import Database from '../../../datasource/database';
import AuthRepository from '../repository/AuthRepository';
import AuthUseCase from '../use-case/AuthUseCase';
import ApiError from '../../../domain/errors/ApiError';
import Utilities from "../../../helpers/Utitlities";

interface AuthValidatorRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        userName: string,
        password: string
    }
}

export default class AuthRoute implements IRoute {
    async register(server: Server, database: Database<any>): Promise<any> {

        const repository = new AuthRepository(database);
        const useCase = new AuthUseCase( repository );
        const validator = createValidator();

        const querySchema = Joi.object({
            userName: Joi.string().required(),
            password: Joi.string().alphanum().min(8).required()
        });

        server.getApp()?.post('/api/v1/auth', validator.body(querySchema),
            async (req: ValidatedRequest<AuthValidatorRequestSchema>, res: express.Response) => {
            try {

                const JWT = require('jsonwebtoken');

                const authData = req.body; 
                authData.password = Utilities.encryptPassword(authData.password);
                const result = await useCase.exec(authData);

                const accessToken = JWT.sign(result, LoadEnv.ACCESS_TOKEN_JWT_SECRET, { expiresIn: 60 * 60 });

                return res.status(200).json({token: accessToken});
            } catch (error) {
                console.error('AuthRoute', error);
                if (error instanceof ApiError) {
                    return res.status(error.code).json({ message: error.message });
                }
                return res.status(200).json({ message: error.message });
            }
        });
    }
}
