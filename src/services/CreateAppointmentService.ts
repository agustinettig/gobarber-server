import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
    providerId: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({ providerId, date }: Request): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(AppointmentsRepository);

        const appointmentDate = startOfHour(date);

        const appointmentOnSameTime = await appointmentsRepository.findByDate(appointmentDate);

        if (appointmentOnSameTime) {
            throw new AppError('There is already a booked appointment');
        }

        const appointment = appointmentsRepository.create({
            providerId,
            date: appointmentDate,
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
