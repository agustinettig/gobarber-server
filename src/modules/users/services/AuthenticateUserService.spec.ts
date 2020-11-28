import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeTokenProvider from '../providers/TokenProvider/fakes/FakeTokenProvider';
import AuthenticateUserService from './AuthenticateUserService';

describe('AuthenticateUser', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let fakeHashProvider: FakeHashProvider;
    let fakeTokenProvider: FakeTokenProvider;
    let authenticateUser: AuthenticateUserService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeTokenProvider = new FakeTokenProvider();
        authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider, fakeTokenProvider);
    });

    it('should be able to authenticate', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        const response = await authenticateUser.execute({
            email: 'johndoe@test.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with the wrong password combination', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        await expect(
            authenticateUser.execute({
                email: 'johndoe@test.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with non existing user', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        await expect(
            authenticateUser.execute({
                email: 'random-user@test.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
