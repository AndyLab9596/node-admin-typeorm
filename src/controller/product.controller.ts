import { Request, Response } from 'express';
import { AppDataSource } from '..';
import { Product } from '../entity/product.entity';

export const Products = async (req: Request, res: Response) => {
    const take = 15;
    const page = parseInt(req.query.page as string || '1');


    const repository = AppDataSource.getRepository(Product);

    const [data, total] = await repository.findAndCount({
        take,
        skip: (page - 1) * take
    });

    res.status(200).send({
        data,
        meta: {
            total,
            page,
            last_page: Math.ceil(total / take)
        }
    });
}

export const CreateProduct = async (req: Request, res: Response) => {
    const repository = AppDataSource.getRepository(Product);
    const product = await repository.save(req.body)
    res.status(201).send(product);
}

export const GetProduct = async (req: Request, res: Response) => {
    const repository = AppDataSource.getRepository(Product);
    const product = await repository.findOne({
        where: {
            id: +req.params.id
        },
    });
    res.status(200).send(product);
}

export const UpdateProduct = async (req: Request, res: Response) => {
    const repository = AppDataSource.getRepository(Product);
    await repository.update(req.params.id, req.body);

    const product = await repository.findOne({
        where: { id: +req.params.id },
    });

    res.status(202).send(product);
}

export const DeleteProduct = async (req: Request, res: Response) => {
    const repository = AppDataSource.getRepository(Product);
    await repository.delete(req.params.id);
    res.status(204).send(null)
}