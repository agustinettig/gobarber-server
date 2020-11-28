import User from '@modules/users/infra/typeorm/entities/User';

interface Response {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

export default class UserMap {
    public static toDTO(user: User): Response {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        };
    }
}
