import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

describe('UpdateProfile', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let fakeHashProvider: FakeHashProvider;
    let updateProfile: UpdateProfileService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
    });

    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            userId: user.id,
            name: 'John Doe 2',
            email: 'johndoe2@test.com',
        });

        expect(updatedUser.name).toBe('John Doe 2');
        expect(updatedUser.email).toBe('johndoe2@test.com');
    });

    it('should not be able to update the profile of a non existing user', async () => {
        await expect(
            updateProfile.execute({
                userId: 'non-existing-id',
                name: 'John Doe 2',
                email: 'johndoe2@test.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the email with an email already in use by another user', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        const user = await fakeUsersRepository.create({
            name: 'Tony Shark',
            email: 'tonyshark@test.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                userId: user.id,
                name: 'Tony Shark',
                email: 'johndoe@test.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            userId: user.id,
            name: 'John Doe 2',
            email: 'johndoe2@test.com',
            oldPassword: '123456',
            password: 'new-password',
        });

        expect(updatedUser.password).toBe('new-password');
    });

    it('should not be able to update the password without the old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                userId: user.id,
                name: 'John Doe 2',
                email: 'johndoe2@test.com',
                password: 'new-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with the wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                userId: user.id,
                name: 'John Doe 2',
                email: 'johndoe2@test.com',
                oldPassword: 'wrong-old-password',
                password: 'new-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
