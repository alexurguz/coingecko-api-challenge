import LoadEnv from '../helpers/LoadEnv';
import * as express from 'express';

export const  authenticateJWT = (req: express.Request, res: express.Response, next: any) => {
        const authHeader = req.headers.authorization;
        const jwt = require('jsonwebtoken');
        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, LoadEnv.ACCESS_TOKEN_JWT_SECRET, (err: any, user: any) => {
                if (err) {
                    return res.sendStatus(403);
                }

                req.headers['userdata'] = user;
                next();
            });
        } else {
            res.sendStatus(401);
        }
    };
