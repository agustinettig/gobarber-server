import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

describe('ListProviderMonthAvailability', () => {
    let fakeAppointmentsRepository: FakeAppointmentsRepository;
    let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderMonthAvailability = new ListProviderMonthAvailabilityService(fakeAppointmentsRepository);
    });

    it('should be able to list the availability of the month from a provider', async () => {
        const createAllAppointments = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(hour =>
            fakeAppointmentsRepository.create({
                providerId: 'provider-id',
                userId: 'user-id',
                date: new Date(2020, 10, 20, hour, 0, 0),
            }),
        );
        createAllAppointments.push(
            fakeAppointmentsRepository.create({
                providerId: 'provider-id',
                userId: 'user-id',
                date: new Date(2020, 10, 21, 8, 0, 0),
            }),
        );
        await Promise.all(createAllAppointments);

        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 0, 1, 0).getTime();
        });

        const availability = await listProviderMonthAvailability.execute({
            providerId: 'provider-id',
            year: 2020,
            month: 11,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 19, available: true },
                { day: 20, available: false },
                { day: 21, available: true },
                { day: 22, available: true },
            ]),
        );
    });
});
