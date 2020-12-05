import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/IFakeCacheProvider';
import FakeNotificationsRepository from '../../notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
    let fakeAppointmentsRepository: FakeAppointmentsRepository;
    let fakeNotificationsRepository: FakeNotificationsRepository;
    let fakeCacheProvider: FakeCacheProvider;
    let createAppointment: CreateAppointmentService;

    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 0, 1, 12).getTime();
        });

        const appointment = await createAppointment.execute({
            providerId: '123456',
            userId: 'user-id',
            date: new Date(2020, 11, 1, 12),
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.providerId).toBe('123456');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const date = new Date(2020, 11, 28, 15);
        await createAppointment.execute({
            providerId: '123456',
            userId: 'user-id',
            date,
        });

        await expect(
            createAppointment.execute({
                providerId: '123456',
                userId: 'user-id',
                date,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 11, 28, 14).getTime();
        });

        await expect(
            createAppointment.execute({
                providerId: '123456',
                userId: 'user-id',
                date: new Date(2020, 11, 28, 12),
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment before 8am', async () => {
        await expect(
            createAppointment.execute({
                providerId: '123456',
                userId: 'user-id',
                date: new Date(2020, 11, 28, 7),
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment after 17pm', async () => {
        await expect(
            createAppointment.execute({
                providerId: '123456',
                userId: 'user-id',
                date: new Date(2020, 11, 28, 20),
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointments with yourself', async () => {
        await expect(
            createAppointment.execute({
                providerId: 'user-id',
                userId: 'user-id',
                date: new Date(2020, 11, 28, 15),
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
