import { sign } from 'jsonwebtoken';

import authConfig from '@config/auth';
import ITokenProvider from '@modules/users/providers/TokenProvider/models/ITokenProvider';
import User from '@modules/users/infra/typeorm/entities/User';

class JwtTokenProvider implements ITokenProvider {
    public async generate({ id }: User): Promise<string> {
        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: id,
            expiresIn,
        });

        return token;
    }
}

export default JwtTokenProvider;
