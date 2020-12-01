import { uuid } from 'uuidv4';
import { getMonth, getYear, isEqual } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../../dtos/IFindAllInMonthFromProviderDTO';

class FakeAppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const appointmentInSameDate = this.appointments.find(appointment => isEqual(appointment.date, date));
        return appointmentInSameDate;
    }

    public async create({ providerId, userId, date }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, {
            id: uuid(),
            providerId,
            userId,
            date,
        });

        this.appointments.push(appointment);

        return appointment;
    }

    public async find(): Promise<Appointment[]> {
        return this.appointments;
    }

    public async findAllInMonthFromProvider({
        providerId,
        year,
        month,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment => {
            return (
                appointment.providerId === providerId &&
                getMonth(appointment.date) === month &&
                getYear(appointment.date) === year
            );
        });

        return appointments;
    }
}

export default FakeAppointmentsRepository;
