import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
    providerId: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ providerId, day, month, year }: IRequest): Promise<Appointment[]> {
        let appointments = await this.cacheProvider.recover<Appointment[]>(
            `appointments-provider:${providerId}:${year}-${month}-${day}`,
        );

        if (!appointments) {
            appointments = await this.appointmentsRepository.findAllInDayFromProvider({
                providerId,
                day,
                month,
                year,
            });

            await this.cacheProvider.save<Appointment[]>(
                `appointments-provider:${providerId}:${year}-${month}-${day}`,
                classToClass(appointments),
            );
        }

        return appointments;
    }
}

export default ListProviderAppointmentsService;
