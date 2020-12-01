import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
    providerId: string;
    day: number;
    month: number;
    year: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({ providerId, day, month, year }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
            providerId,
            day,
            month,
            year,
        });

        const workingHoursInDay = Array.from({ length: 10 }, (_, index) => index + 8);

        const currentDate = new Date(Date.now());

        const availability = workingHoursInDay.map(hour => {
            const hasAppointmentInHour = appointments.find(appointment => getHours(appointment.date) === hour);

            const compareDate = new Date(year, month - 1, day, hour);

            return {
                hour,
                available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
            };
        });

        return availability;
    }
}

export default ListProviderDayAvailabilityService;
