import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';
import UsersController from '@modules/users/infra/http/controllers/UsersController';
import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

const usersRouter = Router();
const upload = multer(uploadConfig);
const usersController = new UsersController();
const profileController = new ProfileController();

usersRouter.post('/', usersController.create);

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), usersController.updateAvatar);

usersRouter.put('/profile', ensureAuthenticated, profileController.update);

export default usersRouter;
