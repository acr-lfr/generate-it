import { Joi } from 'celebrate';

export default {
  weatherGet: {
    query: {
      appid: Joi.string().required(),
      q: Joi.string().allow(''),
      id: Joi.number(),
      lat: Joi.number(),
      lon: Joi.number(),
    },
  },

  weatherIdGet: {
    params: { id: Joi.string().required() },
  },
};
