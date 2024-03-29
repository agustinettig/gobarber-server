import { getRepository, Repository } from 'typeorm';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

class UserTokensRepository implements IUserTokensRepository {
    private ormRepository: Repository<UserToken>;

    constructor() {
        this.ormRepository = getRepository(UserToken);
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {
        const userTokenFound = await this.ormRepository.findOne(token);
        return userTokenFound;
    }

    public async generate(userId: string): Promise<UserToken> {
        const userToken = this.ormRepository.create({
            userId,
        });

        await this.ormRepository.save(userToken);

        return userToken;
    }
}

export default UserTokensRepository;
