import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<User> {
        const usersRepository = getRepository(User);

        const emailExists = await usersRepository.findOne({
            where: {
                email,
            },
        });

        if (emailExists) {
            throw new AppError('Email already exists');
        }

        const hashedPass = await hash(password, 8);

        const user = usersRepository.create({
            name,
            email,
            password: hashedPass,
        });

        await usersRepository.save(user);

        return user;
    }
}

export default CreateUserService;
