import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';

export default class ProfileController {
    public async update(request: Request, response: Response): Promise<Response> {
        const { name, email, oldPassword, password } = request.body;

        const user = await container.resolve(UpdateProfileService).execute({
            userId: request.user.id,
            name,
            email,
            oldPassword,
            password,
        });
        return response.json(classToClass(user));
    }
}
