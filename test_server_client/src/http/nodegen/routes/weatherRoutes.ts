import express from 'express';
import Router from 'express-promise-router';
import objectReduceByMap from 'object-reduce-by-map';

import { celebrate } from 'celebrate';
import accessTokenMiddleware from '../middleware/accessTokenMiddleware';

import permissionMiddleware from '../middleware/permissionMiddleware';

import weatherValidators from '../validators/weatherValidators';
import WeatherDomain from '../../../domains/WeatherDomain';
import weatherTransformOutputs from '../transformOutputs/weatherTransformOutput';

export default function () {
  const router = Router();

  /**
   * Operation ID: weatherGet
   * Summary: Get weather
   * Description: Query with varying content
   */

  router.get(
    '/',
    accessTokenMiddleware([
      'x-api-key',
      'Authorization',
    ]) /* Validate request security tokens */,

    celebrate(
      weatherValidators.weatherGet
    ) /* Validate the request data and return validation errors */,

    async (req: any, res: express.Response) => {
      return res
        .status(200)
        .json(
          objectReduceByMap(
            await WeatherDomain.weatherGet(
              req.headers,
              req.jwtData,
              req.query,
              req
            ),
            weatherTransformOutputs.weatherGet
          )
        );
    }
  );

  /**
   * Operation ID: weatherIdGet
   * Summary: Get weather
   * Description: Query with varying content
   */

  router.get(
    '/:id',
    accessTokenMiddleware(['x-api-key', 'Authorization'], {
      passThruWithoutJWT: true,
    }) /* Validate request security tokens */,
    permissionMiddleware(
      'getWeatherDetail'
    ) /* Check permission of the incoming user */,
    celebrate(
      weatherValidators.weatherIdGet
    ) /* Validate the request data and return validation errors */,

    async (req: any, res: express.Response) => {
      return res
        .status(200)
        .json(
          objectReduceByMap(
            await WeatherDomain.weatherIdGet(req.jwtData, req.params),
            weatherTransformOutputs.weatherIdGet
          )
        );
    }
  );

  return router;
}
