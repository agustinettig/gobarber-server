import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let fakeStorageProvider: FakeStorageProvider;
    let updateUserAvatar: UpdateUserAvatarService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
    });

    it('should be able to update the avatar', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        const updatedAvatar = await updateUserAvatar.execute({
            userId: user.id,
            avatarFileName: 'avatar-file-name.png',
        });

        expect(updatedAvatar.avatar).toBe('avatar-file-name.png');
    });

    it('should not be able to update the avatar of a non existing user', async () => {
        await expect(
            updateUserAvatar.execute({
                userId: 'invalid-user-id',
                avatarFileName: 'avatar-file-name.png',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be delete the old avatar when updating to a new one', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            userId: user.id,
            avatarFileName: 'avatar-file-name.png',
        });

        const updatedAvatar = await updateUserAvatar.execute({
            userId: user.id,
            avatarFileName: 'new-avatar-file-name.png',
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar-file-name.png');
        expect(updatedAvatar.avatar).toBe('new-avatar-file-name.png');
    });
});
