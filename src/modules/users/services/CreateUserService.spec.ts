import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/IFakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let fakeHashProvider: FakeHashProvider;
    let fakeCacheProvider: FakeCacheProvider;

    let createUser: CreateUserService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
    });

    it('should be able to create a new user', async () => {
        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
        expect(user.name).toBe('John Doe');
        expect(user.email).toBe('johndoe@test.com');
    });

    it('should not be able to create a new user with an email already in use', async () => {
        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        await expect(
            createUser.execute({
                name: 'John Doe',
                email: 'johndoe@test.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
