import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
    const { email, password } = request.body;

    const { token } = await new AuthenticateUserService().execute({
        email,
        password,
    });

    return response.status(201).json({ token });
});

export default sessionsRouter;
