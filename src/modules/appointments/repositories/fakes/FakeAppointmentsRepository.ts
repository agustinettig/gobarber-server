import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

class FakeAppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const appointmentInSameDate = this.appointments.find(appointment => isEqual(appointment.date, date));
        return appointmentInSameDate;
    }

    public async create({ providerId, date }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, {
            id: uuid(),
            providerId,
            date,
        });

        this.appointments.push(appointment);

        return appointment;
    }

    public async find(): Promise<Appointment[]> {
        return this.appointments;
    }
}

export default FakeAppointmentsRepository;
