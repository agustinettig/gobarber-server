import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeEmailProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakerUserTokensRepository';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

describe('SendForgotPasswordEmail', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let fakeUserTokensRepository: FakeUserTokensRepository;
    let fakeMailProvider: FakeMailProvider;
    let sendForgotPasswordEmail: SendForgotPasswordEmailService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeMailProvider = new FakeMailProvider();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeMailProvider,
        );
    });

    it('should be able to recover the password using the email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'johndoe@test.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover the password using a non existing email', async () => {
        await expect(
            sendForgotPasswordEmail.execute({
                email: 'johndoe@test.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'johndoe@test.com',
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
