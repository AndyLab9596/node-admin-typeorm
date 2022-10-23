import { Request, Response } from "express"
import { AppDataSource } from ".."
import { Permission } from "../entity/permission.entity"

export const Permissions = async (req: Request, res: Response) => {
    const repository = AppDataSource.getRepository(Permission);

    res.status(200).send(await repository.find());
}