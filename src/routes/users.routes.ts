import { Router } from 'express';
import UserMap from '../mappers/UserMap';

import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const user = await new CreateUserService().execute({
            name,
            email,
            password,
        });

        return response.status(201).json(UserMap.toDTO(user));
    } catch (err) {
        return response.status(400).json({ message: err.message });
    }
});

export default usersRouter;
