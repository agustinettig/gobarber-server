import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

describe('ListProviderAppointments', () => {
    let fakeAppointmentsRepository: FakeAppointmentsRepository;
    let listProviderAppointments: ListProviderAppointmentsService;

    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderAppointments = new ListProviderAppointmentsService(fakeAppointmentsRepository);
    });

    it('should be able to list the appointments of the day from a provider', async () => {
        const appoitment1 = await fakeAppointmentsRepository.create({
            providerId: 'provider-id',
            userId: 'user-id',
            date: new Date(2020, 10, 21, 8, 0, 0),
        });

        const appoitment2 = await fakeAppointmentsRepository.create({
            providerId: 'provider-id',
            userId: 'user-id',
            date: new Date(2020, 10, 21, 14, 0, 0),
        });

        const appointments = await listProviderAppointments.execute({
            providerId: 'provider-id',
            year: 2020,
            month: 11,
            day: 21,
        });

        expect(appointments).toEqual(expect.arrayContaining([appoitment1, appoitment2]));
    });
});
