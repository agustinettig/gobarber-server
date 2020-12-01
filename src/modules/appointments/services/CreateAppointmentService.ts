import { getHours, isBefore, startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
    providerId: string;
    userId: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({ providerId, userId, date }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        if (userId === providerId) {
            throw new AppError("You can't create an appointment with yourself");
        }

        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError("You can't create an appointment at this time");
        }

        if (isBefore(appointmentDate, new Date(Date.now()))) {
            throw new AppError("You can't create an appointment on a past date");
        }

        const appointmentOnSameTime = await this.appointmentsRepository.findByDate(appointmentDate);

        if (appointmentOnSameTime) {
            throw new AppError('There is already a booked appointment');
        }

        const appointment = await this.appointmentsRepository.create({
            providerId,
            userId,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
