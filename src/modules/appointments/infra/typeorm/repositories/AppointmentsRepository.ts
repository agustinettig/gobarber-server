import { getRepository, Raw, Repository } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';

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

    public async create({ providerId, userId, date }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            providerId,
            userId,
            date,
        });

        await this.ormRepository.save(appointment);

        return appointment;
    }

    public async find(): Promise<Appointment[]> {
        const appointments = await this.ormRepository.find();
        return appointments;
    }

    public async findAllInMonthFromProvider({
        providerId,
        year,
        month,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                providerId,
                date: Raw(dateFieldName => `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`),
            },
        });

        return appointments;
    }
}

export default AppointmentsRepository;
