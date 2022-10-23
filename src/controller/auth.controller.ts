import bcrypt from 'bcryptjs';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { AppDataSource } from "..";
import { User } from "../entity/user.entity";
import { RegisterValidation } from "../validation/register.validation";

export const Register = async (req: Request, res: Response) => {
    const body = req.body;

    const { error } = RegisterValidation.validate(body);

    if (error) {
        return res.status(400).send(error.details);
    }

    if (body.password !== body.password_confirm) {
        return res.status(400).send({
            message: "Password does not match"
        })
    }

    const salt = bcrypt.genSaltSync(10);
    const user = new User();
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    user.password = await bcrypt.hash(req.body.password, salt);

    await AppDataSource.manager.save(user)

    const { password, ...newUser } = user
    res.send(newUser);
}

export const Login = async (req: Request, res: Response) => {
    const user = await AppDataSource.manager.findOneBy(User, {
        email: req.body.email
    });

    if (!user) {
        return res.status(404).send({
            message: "User not found"
        })
    }

    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: "Invalid credential"
        })
    }

    const token = jwt.sign({
        id: user.id
    }, process.env.SECRET_KEY)

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.send({
        message: "Login successfully"
    });
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    const {password, ...user} = req['user'];
    res.send(user)
}

export const Logout = async (req: Request, res: Response) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.send({
        message: 'Logout success'
    })
}

export const UpdateInfo = async (req: Request, res: Response) => {
    const user = req['user'];
    const userRepository = AppDataSource.getRepository(User);

    const userUpdate = await userRepository.findOneBy({
        id: user.id
    })

    userUpdate.first_name = req.body.first_name;
    userUpdate.last_name = req.body.last_name;
    userUpdate.email = req.body.email;

    const {password, ...newUser} = await userRepository.save(userUpdate);

    res.status(200).send(newUser)
}

export const UpdatePassword = async (req: Request, res: Response) => {
    const user = req['user'];
    
    if (req.body.password !== req.body.password_confirm) {
        return res.status(400).send({
            message: "Password does not match"
        })
    }

    const userRepository = AppDataSource.getRepository(User);
    const userUpdate = await userRepository.findOneBy({
        id: user.id
    })
    const salt = bcrypt.genSaltSync(10);
    userUpdate.password = await bcrypt.hash(req.body.password, salt);
    const {password, ...newUser} = await userRepository.save(userUpdate);
    res.status(200).send(newUser)
}

