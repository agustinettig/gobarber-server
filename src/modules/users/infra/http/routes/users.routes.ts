import { Router } from 'express';
import multer from 'multer';
import { celebrate, Joi, Segments } from 'celebrate';

import uploadConfig from '@config/upload';
import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';
import UsersController from '@modules/users/infra/http/controllers/UsersController';
import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

const usersRouter = Router();
const upload = multer(uploadConfig.multer);
const usersController = new UsersController();
const profileController = new ProfileController();

usersRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
    }),
    usersController.create,
);

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), usersController.updateAvatar);

usersRouter.put(
    '/profile',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            oldPassword: Joi.string(),
            password: Joi.string(),
            passwordConfirmation: Joi.string().valid(Joi.ref('password')),
        },
    }),
    ensureAuthenticated,
    profileController.update,
);

export default usersRouter;
