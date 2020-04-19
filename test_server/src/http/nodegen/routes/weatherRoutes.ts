import express from 'express';
import Router from 'express-promise-router';
import objectReduceByMap from 'object-reduce-by-map';

import NodegenRequest from '../interfaces/NodegenRequest';

import { celebrate } from 'celebrate';
import permissionMiddleware from '../middleware/permissionMiddleware';
import accessTokenMiddleware from '../middleware/accessTokenMiddleware';
import weatherValidators from '../validators/weatherValidators';
import WeatherDomain from '../../../domains/WeatherDomain';
import weatherTransformOutputs from '../transformOutputs/weatherTransformOutput';

export default function () {
  const router = Router();

  /**
   * Operation ID: weatherGet
   * Summary: weather data
   * Description: Get the latest temperatures
   */

  router.get(
    '/',

    celebrate(
      weatherValidators.weatherGet
    ) /* Finally, validate the request data and return validation errors */,
    async (req: any, res: express.Response) => {
      return res.json(
        objectReduceByMap(
          await WeatherDomain.weatherGet(req.headers, req.params),
          weatherTransformOutputs.weatherGet
        )
      );
    }
  );

  /**
   * Operation ID: weatherPost
   * Summary: weather data
   * Description: Create a new weather record.
   */

  router.post(
    '/',

    celebrate(
      weatherValidators.weatherPost
    ) /* Finally, validate the request data and return validation errors */,
    async (req: any, res: express.Response) => {
      return res.json(
        objectReduceByMap(
          await WeatherDomain.weatherPost(req.body),
          weatherTransformOutputs.weatherPost
        )
      );
    }
  );

  /**
   * Operation ID: weatherIdGet
   * Summary: weather data
   * Description: Get the latest temperatures
   */

  router.get(
    '/id/:id',

    celebrate(
      weatherValidators.weatherIdGet
    ) /* Finally, validate the request data and return validation errors */,
    async (req: any, res: express.Response) => {
      return res.json(
        objectReduceByMap(
          await WeatherDomain.weatherIdGet(req.params),
          weatherTransformOutputs.weatherIdGet
        )
      );
    }
  );

  /**
   * Operation ID: weatherIdPut
   * Summary: weather data
   * Description: Create a new weather record.
   */

  router.put(
    '/id/:id',

    celebrate(
      weatherValidators.weatherIdPut
    ) /* Finally, validate the request data and return validation errors */,
    async (req: any, res: express.Response) => {
      return res.json(
        objectReduceByMap(
          await WeatherDomain.weatherIdPut(req.body, req.params),
          weatherTransformOutputs.weatherIdPut
        )
      );
    }
  );

  return router;
}
