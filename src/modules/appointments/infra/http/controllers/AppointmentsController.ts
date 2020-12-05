import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
    public async create(request: Request, response: Response): Promise<Response> {
        const userId = request.user.id;
        const { providerId, date } = request.body;

        const appointment = await container.resolve(CreateAppointmentService).execute({
            providerId,
            userId,
            date,
        });

        return response.status(201).json(appointment);
    }
}
