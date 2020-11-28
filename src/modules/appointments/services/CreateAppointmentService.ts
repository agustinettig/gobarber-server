import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
    providerId: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({ providerId, date }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        const appointmentOnSameTime = await this.appointmentsRepository.findByDate(appointmentDate);

        if (appointmentOnSameTime) {
            throw new AppError('There is already a booked appointment');
        }

        const appointment = await this.appointmentsRepository.create({
            providerId,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
