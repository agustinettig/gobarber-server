import User from '../models/User';

interface Response {
    id: string;
    name: string;
    email: string;
}

export default class UserMap {
    public static toDTO(user: User): Response {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
}
