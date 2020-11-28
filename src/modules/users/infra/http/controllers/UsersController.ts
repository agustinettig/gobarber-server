import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import UserMap from '@modules/users/mappers/UserMap';

export default class UsersController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { name, email, password } = request.body;

        const user = await container.resolve(CreateUserService).execute({
            name,
            email,
            password,
        });

        return response.status(201).json(UserMap.toDTO(user));
    }

    public async updateAvatar(request: Request, response: Response): Promise<Response> {
        const user = await container.resolve(UpdateUserAvatarService).execute({
            userId: request.user.id,
            avatarFileName: request.file.filename,
        });
        return response.json(UserMap.toDTO(user));
    }
}
