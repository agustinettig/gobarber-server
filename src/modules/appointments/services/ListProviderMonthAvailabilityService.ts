import { inject, injectable } from 'tsyringe';
import { getDate, getDaysInMonth, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { compare } from 'bcryptjs';

interface IRequest {
    providerId: string;
    month: number;
    year: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListProvidersService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({ providerId, month, year }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({ providerId, month, year });

        const daysInMonth = getDaysInMonth(new Date(year, month - 1));

        const eachDayArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);

        const availability = eachDayArray.map(day => {
            const compareDate = new Date(year, month - 1, day, 23, 59, 59);

            const appointmentsInDay = appointments.filter(appointment => {
                return getDate(appointment.date) === day;
            });
            return {
                day,
                available: isAfter(compareDate, new Date(Date.now())) && appointmentsInDay.length < 10,
            };
        });

        return availability;
    }
}

export default ListProvidersService;
