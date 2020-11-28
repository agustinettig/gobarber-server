import ITokenProvider from '@modules/users/providers/TokenProvider/models/ITokenProvider';
import User from '@modules/users/infra/typeorm/entities/User';

class FakeTokenProvider implements ITokenProvider {
    public async generate({ id }: User): Promise<string> {
        return `token-${id}`;
    }
}

export default FakeTokenProvider;
