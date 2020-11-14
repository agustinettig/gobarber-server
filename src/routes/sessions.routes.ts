import { Router } from 'express';
import UserMap from '../mappers/UserMap';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
    const { email, password } = request.body;

    const { user, token } = await new AuthenticateUserService().execute({
        email,
        password,
    });

    return response.status(201).json({ user: UserMap.toDTO(user), token });
});

export default sessionsRouter;
