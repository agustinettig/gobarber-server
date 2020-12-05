import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvailabiltyController = new ProviderMonthAvailabilityController();
const providerDayAvailabiltyController = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get(
    '/:providerId/month-availability',
    celebrate({
        [Segments.PARAMS]: {
            providerId: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            year: Joi.string().required(),
            month: Joi.string().required(),
        },
    }),
    providerMonthAvailabiltyController.index,
);
providersRouter.get(
    '/:providerId/day-availability',
    celebrate({
        [Segments.PARAMS]: {
            providerId: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            year: Joi.string().required(),
            month: Joi.string().required(),
            day: Joi.string().required(),
        },
    }),
    providerDayAvailabiltyController.index,
);

export default providersRouter;
