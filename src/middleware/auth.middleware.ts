import { Response, Request, NextFunction } from 'express';
import jwt, { verify } from 'jsonwebtoken'
import { AppDataSource } from '..';
import { User } from '../entity/user.entity';

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwt = req.cookies['jwt'];
        const payload = verify(jwt, process.env.SECRET_KEY) as { id: number };

        if (!payload) {
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }
        const userRepository = AppDataSource.getRepository(User);
        req['user'] = await userRepository.findOneBy({
            id: payload.id
        })
        next()
    } catch (e) {
        return res.status(401).send({
            message: 'Unauthenticated'
        })
    }
}