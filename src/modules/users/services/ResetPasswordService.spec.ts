import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakerUserTokensRepository';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

describe('ResetPassword', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let fakeUserTokensRepository: FakeUserTokensRepository;
    let fakeHashProvider: FakeHashProvider;
    let resetPassword: ResetPasswordService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(fakeUsersRepository, fakeUserTokensRepository, fakeHashProvider);
    });

    it('should be able to reset the password', async () => {
        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        const userToken = await fakeUserTokensRepository.generate(user.id);

        await resetPassword.execute({
            token: userToken.token,
            password: 'updated-password',
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('updated-password');
        expect(updatedUser?.password).toBe('updated-password');
    });

    it('should not be able to reset the password with an invalid token', async () => {
        await expect(
            resetPassword.execute({
                token: 'invalid-token',
                password: 'updated-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with an expired token (2 hours)', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3);
        });

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        const userToken = await fakeUserTokensRepository.generate(user.id);

        await expect(
            resetPassword.execute({
                token: userToken.token,
                password: 'updated-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non existing user', async () => {
        const userToken = await fakeUserTokensRepository.generate('non-existing-user');

        await expect(
            resetPassword.execute({
                token: userToken.token,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
