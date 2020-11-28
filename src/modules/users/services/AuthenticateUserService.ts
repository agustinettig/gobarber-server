import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import ITokenProvider from '@modules/users/providers/TokenProvider/models/ITokenProvider';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,

        @inject('TokenProvider')
        private tokenProvider: ITokenProvider,
    ) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Invalid email/password.');
        }

        const validPassword = await this.hashProvider.compareHash(password, user.password);

        if (!validPassword) {
            throw new AppError('Invalid email/password.');
        }

        const token = await this.tokenProvider.generate(user);

        return { user, token };
    }
}

export default AuthenticateUserService;
