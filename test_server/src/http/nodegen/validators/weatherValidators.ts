import { Joi } from 'celebrate';

export default {
  weatherGet: {
    params: { id: Joi.number().integer().required() },
  },

  weatherPost: {
    body: {
      date: Joi.string().allow(''),
      location: Joi.string().allow(''),
      cloudCoverPercentage: Joi.number().integer(),
      humidityPercentage: Joi.number().integer(),
      temperature: Joi.number(),
      date: Joi.string().allow(''),
      location: Joi.string().allow(''),
      cloudCoverPercentage: Joi.number().integer(),
      humidityPercentage: Joi.number().integer(),
      temperature: Joi.number(),
    },
  },

  weatherIdGet: {
    params: { id: Joi.number().integer().required() },
  },

  weatherIdPut: {
    body: {
      date: Joi.string().allow(''),
      location: Joi.string().allow(''),
      cloudCoverPercentage: Joi.number().integer(),
      humidityPercentage: Joi.number().integer(),
      temperature: Joi.number(),
      id: Joi.number().integer(),
      date: Joi.string().allow(''),
      location: Joi.string().allow(''),
      cloudCoverPercentage: Joi.number().integer(),
      humidityPercentage: Joi.number().integer(),
      temperature: Joi.number(),
      id: Joi.number().integer(),
    },
    params: { id: Joi.number().integer().required() },
  },
};
