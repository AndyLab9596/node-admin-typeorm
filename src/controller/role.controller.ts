import { Request, Response } from "express";
import { AppDataSource } from "..";
import { Role } from "../entity/role.entity";

export const Roles = async (req: Request, res: Response) => {
    const repository = AppDataSource.getRepository(Role);

    res.status(200).send(await repository.find());
}

export const CreateRole = async (req: Request, res: Response) => {
    const repository = AppDataSource.getRepository(Role);

    const { name, permissions } = req.body;

    const role = await repository.save({
        name,
        permissions: permissions.map((id) => ({ id }))
    })

    res.status(201).send(role);
}

export const GetRole = async (req: Request, res: Response) => {
    const repository = AppDataSource.getRepository(Role);
    res.status(200).send(await repository.findOne({
        where: {
            id: +req.params.id
        },
        relations: ['permissions']
    }))
}

export const UpdateRole = async (req: Request, res: Response) => {
    const repository = AppDataSource.getRepository(Role);
    const { name, permissions } = req.body;
    const role = await repository.save({
        id: +req.params.id,
        name,
        permissions: permissions.map((id) => ({ id }))
    })
    res.status(202).send(role);
}

export const DeleteRole = async (req: Request, res: Response) => {
    const repository = AppDataSource.getRepository(Role);
    await repository.delete(req.params.id);
    res.status(204).send(null)
}