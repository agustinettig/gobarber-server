import { parseISO } from 'date-fns';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { providerId, date } = request.body;

        const parsedDate = parseISO(date);

        const appointment = await container.resolve(CreateAppointmentService).execute({
            providerId,
            date: parsedDate,
        });

        return response.status(201).json(appointment);
    }

    public async index(request: Request, response: Response): Promise<Response> {
        const appointmentsRepository = new AppointmentsRepository();
        const appointments = await appointmentsRepository.find();

        return response.json(appointments);
    }
}
