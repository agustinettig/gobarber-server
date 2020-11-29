import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import UserMap from '@modules/users/mappers/UserMap';

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
        return response.json(UserMap.toDTO(user));
    }
}
