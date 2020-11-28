import User from '@modules/users/infra/typeorm/entities/User';

export default interface ITokenProvider {
    generate(user: User): Promise<string>;
}
