import { getRepository, Repository } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const appointmentInSameDate = await this.ormRepository.findOne({
            where: {
                date,
            },
        });
        return appointmentInSameDate;
    }

    public async create({ providerId, date }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            providerId,
            date,
        });

        await this.ormRepository.save(appointment);

        return appointment;
    }

    public async find(): Promise<Appointment[]> {
        const appointments = await this.ormRepository.find();
        return appointments;
    }
}

export default AppointmentsRepository;
