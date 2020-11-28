import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
    let fakeAppointmentsRepositor: FakeAppointmentsRepository;
    let createAppointment: CreateAppointmentService;

    beforeEach(() => {
        fakeAppointmentsRepositor = new FakeAppointmentsRepository();
        createAppointment = new CreateAppointmentService(fakeAppointmentsRepositor);
    });

    it('should be able to create a new appointment', async () => {
        const appointment = await createAppointment.execute({
            providerId: '123456',
            date: new Date(),
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.providerId).toBe('123456');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const date = new Date(2020, 11, 28, 15);
        await createAppointment.execute({
            providerId: '123456',
            date,
        });

        await expect(
            createAppointment.execute({
                providerId: '123456',
                date,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
