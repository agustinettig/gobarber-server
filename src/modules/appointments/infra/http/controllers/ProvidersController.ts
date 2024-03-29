import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import { classToClass } from 'class-transformer';

export default class ProvidersController {
    public async index(request: Request, response: Response): Promise<Response> {
        const userId = request.user.id;

        const providers = await container.resolve(ListProvidersService).execute({
            userId,
        });

        return response.status(201).json(classToClass(providers));
    }
}
