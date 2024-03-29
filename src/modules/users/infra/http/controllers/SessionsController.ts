import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;

        const { user, token } = await container.resolve(AuthenticateUserService).execute({
            email,
            password,
        });

        return response.status(201).json({ user: classToClass(user), token });
    }
}
