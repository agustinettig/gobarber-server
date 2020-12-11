import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
    userId: string;
}

@injectable()
class ListProvidersService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ userId }: IRequest): Promise<User[]> {
        let providers = await this.cacheProvider.recover<User[]>(`providers-user:${userId}`);

        if (!providers) {
            providers = await this.usersRepository.findAllProviders({
                exceptUserId: userId,
            });

            await this.cacheProvider.save<User[]>(`providers-user:${userId}`, classToClass(providers));
        }

        return providers;
    }
}

export default ListProvidersService;
