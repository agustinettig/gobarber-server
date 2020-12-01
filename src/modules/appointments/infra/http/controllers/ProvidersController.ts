import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
    public async index(request: Request, response: Response): Promise<Response> {
        const userId = request.user.id;

        const appointment = await container.resolve(ListProvidersService).execute({
            userId,
        });

        return response.status(201).json(appointment);
    }
}
