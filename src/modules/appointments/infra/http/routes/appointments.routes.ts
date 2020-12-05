import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            providerId: Joi.string().uuid().required(),
            date: Joi.date().required(),
        },
    }),
    appointmentsController.create,
);
appointmentsRouter.get(
    '/schedule',
    celebrate({
        [Segments.BODY]: {
            year: Joi.string().required(),
            month: Joi.string().required(),
            day: Joi.string().required(),
        },
    }),
    providerAppointmentsController.index,
);

export default appointmentsRouter;
