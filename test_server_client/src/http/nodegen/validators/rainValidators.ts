import { Joi } from 'celebrate';

export default {
  rainGet: {
    query: { q: Joi.string().allow('') },
  },

  rainPost: {
    body: { lon: Joi.number(), lat: Joi.number() },
  },

  rainPut: {},
};
