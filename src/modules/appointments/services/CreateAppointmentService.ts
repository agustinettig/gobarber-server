import { format, getHours, isBefore, startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

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

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
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

        const appointmentOnSameTime = await this.appointmentsRepository.findByDate(appointmentDate, providerId);

        if (appointmentOnSameTime) {
            throw new AppError('There is already a booked appointment');
        }

        const appointment = await this.appointmentsRepository.create({
            providerId,
            userId,
            date: appointmentDate,
        });

        const notificationDate = format(appointmentDate, "yyyy-MM-dd 'at' hh:mm a");

        await this.notificationsRepository.create({
            content: `New appointment on ${notificationDate}`,
            recipientId: providerId,
        });

        await this.cacheProvider.invalidate(
            `appointments-provider:${providerId}:${format(appointmentDate, 'yyyy-M-d')}`,
        );

        return appointment;
    }
}

export default CreateAppointmentService;
