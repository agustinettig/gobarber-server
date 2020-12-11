import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { classToClass } from 'class-transformer';

export default class AppointmentsController {
    public async index(request: Request, response: Response): Promise<Response> {
        const providerId = request.user.id;
        const { day, month, year } = request.query;

        const appointments = await container.resolve(ListProviderAppointmentsService).execute({
            providerId,
            day: Number(day),
            month: Number(month),
            year: Number(year),
        });

        return response.status(201).json(classToClass(appointments));
    }
}
