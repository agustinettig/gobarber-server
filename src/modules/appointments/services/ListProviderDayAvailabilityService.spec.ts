import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

describe('ListProviderDayAvailability', () => {
    let fakeAppointmentsRepository: FakeAppointmentsRepository;
    let listProviderDayAvailability: ListProviderDayAvailabilityService;

    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderDayAvailability = new ListProviderDayAvailabilityService(fakeAppointmentsRepository);
    });

    it('should be able to list the availability of the day from a provider', async () => {
        await fakeAppointmentsRepository.create({
            providerId: 'provider-id',
            userId: 'user-id',
            date: new Date(2020, 10, 21, 8, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            providerId: 'provider-id',
            userId: 'user-id',
            date: new Date(2020, 10, 21, 14, 0, 0),
        });

        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 10, 21, 12).getTime();
        });

        const availability = await listProviderDayAvailability.execute({
            providerId: 'provider-id',
            year: 2020,
            month: 11,
            day: 21,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { hour: 8, available: false },
                { hour: 9, available: false },
                { hour: 10, available: false },
                { hour: 13, available: true },
                { hour: 14, available: false },
                { hour: 15, available: true },
            ]),
        );
    });
});
