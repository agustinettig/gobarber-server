import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/IFakeCacheProvider';
import ListProvidersService from './ListProvidersService';

describe('ListProvider', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let fakeCacheProvider: FakeCacheProvider;
    let listProviders: ListProvidersService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviders = new ListProvidersService(fakeUsersRepository, fakeCacheProvider);
    });

    it('should be able to list the providers', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        const user2 = await fakeUsersRepository.create({
            name: 'Tony Shark',
            email: 'tonyshark@test.com',
            password: '123456',
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'John Cena',
            email: 'johncena@example.com',
            password: '123456',
        });

        const providers = await listProviders.execute({
            userId: loggedUser.id,
        });

        expect(providers).toEqual([user1, user2]);
    });
});
