import { Request, Response } from 'express';
import { AppDataSource } from '..';
import { User } from '../entity/user.entity';
import bcrypt from 'bcryptjs';

export const Users = async (req: Request, res: Response) => {
    const take = 1;
    const page = parseInt(req.query.page as string || '1');

    const userRepository = AppDataSource.getRepository(User);

    const [users, total] = await userRepository.findAndCount({
        take,
        skip: (page - 1) * take,
        relations: ['role']
    })

    res.status(200).send({
        data: users.map((u) => {
            const { password, ...data } = u;
            return data
        }),
        meta: {
            total,
            page,
            last_page: Math.ceil(total / take)
        }
    })
}

export const CreateUser = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const { role_id, ...body } = req.body;
    const hashPassword = await bcrypt.hash('1234', 10);
    const { password, ...user } = await userRepository.save({
        ...body,
        password: hashPassword,
        role: {
            id: role_id,
        }
    })
    res.status(201).send(user);
}

export const GetUser = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const { password, ...user } = await userRepository.findOne({
        where: {
            id: +req.params.id
        },
        relations: ['role']
    });
    res.status(200).send(user);
}

export const UpdateUser = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const { role_id, ...body } = req.body;

    await userRepository.update(req.params.id, {
        ...body,
        role: {
            id: role_id
        }
    });

    const { password, ...user } = await userRepository.findOne({
        where: { id: +req.params.id },
        relations: ['role']
    });

    res.status(202).send(user);
}

export const DeleteUser = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.delete(req.params.id);
    res.status(204).send(null)
}