import { uuid } from 'uuidv4';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

class UserTokensRepository implements IUserTokensRepository {
    private tokens: UserToken[] = [];

    public async findByToken(token: string): Promise<UserToken | undefined> {
        return this.tokens.find(userToken => userToken.token === token);
    }

    public async generate(userId: string): Promise<UserToken> {
        const token = new UserToken();

        Object.assign(token, {
            id: uuid(),
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        this.tokens.push(token);

        return token;
    }
}

export default UserTokensRepository;
