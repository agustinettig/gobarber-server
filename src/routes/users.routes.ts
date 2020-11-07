import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import UserMap from '../mappers/UserMap';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    const user = await new CreateUserService().execute({
        name,
        email,
        password,
    });

    return response.status(201).json(UserMap.toDTO(user));
});

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
    const user = await new UpdateUserAvatarService().execute({
        userId: request.user.id,
        avatarFileName: request.file.filename,
    });
    return response.json(UserMap.toDTO(user));
});

export default usersRouter;
