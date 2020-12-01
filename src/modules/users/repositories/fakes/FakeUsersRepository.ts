import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import IFindAllProvidersDTO from '../../dtos/IFindAllProvidersDTO';

class UsersRepository implements IUsersRepository {
    private users: User[] = [];

    public async findByEmail(email: string): Promise<User | undefined> {
        const userFound = this.users.find(user => user.email === email);
        return userFound;
    }

    public async findById(id: string): Promise<User | undefined> {
        const userFound = this.users.find(user => user.id === id);
        return userFound;
    }

    public async create({ name, email, password }: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, {
            id: uuid(),
            name,
            email,
            password,
        });

        this.users.push(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        const userIndex = this.users.findIndex(findUser => findUser.id === user.id);
        this.users[userIndex] = user;
        return user;
    }

    public async findAllProviders({ exceptUserId }: IFindAllProvidersDTO): Promise<User[]> {
        return exceptUserId ? this.users.filter(user => user.id !== exceptUserId) : this.users;
    }
}

export default UsersRepository;
