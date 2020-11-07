import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
    try {
        const { email, password } = request.body;

        const { token } = await new AuthenticateUserService().execute({
            email,
            password,
        });

        return response.status(201).json({ token });
    } catch (err) {
        return response.status(400).json({ message: err.message });
    }
});

export default sessionsRouter;
