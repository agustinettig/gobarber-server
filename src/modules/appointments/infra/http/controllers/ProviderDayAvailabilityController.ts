import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
    public async index(request: Request, response: Response): Promise<Response> {
        const { providerId } = request.params;
        const { day, month, year } = request.query;

        const availability = await container.resolve(ListProviderDayAvailabilityService).execute({
            providerId,
            day: Number(day),
            month: Number(month),
            year: Number(year),
        });

        return response.status(201).json(availability);
    }
}
