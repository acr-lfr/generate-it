import express from 'express';
import Router from 'express-promise-router';
import objectReduceByMap from 'object-reduce-by-map';

import { celebrate } from 'celebrate';

import rainValidators from '../validators/rainValidators';
import RainDomain from '../../../domains/RainDomain';
import rainTransformOutputs from '../transformOutputs/rainTransformOutput';

export default function () {
  const router = Router();

  /**
   * Operation ID: rainGet
   * Summary: Get weather
   * Description: Query with varying content
   */

  router.get(
    '/',

    celebrate(
      rainValidators.rainGet
    ) /* Validate the request data and return validation errors */,

    async (req: any, res: express.Response) => {
      return res
        .status(200)
        .json(
          objectReduceByMap(
            await RainDomain.rainGet(req.query),
            rainTransformOutputs.rainGet
          )
        );
    }
  );

  /**
   * Operation ID: rainPost
   * Summary: Get weather
   * Description: Query with varying content
   */

  router.post(
    '/',

    celebrate(
      rainValidators.rainPost
    ) /* Validate the request data and return validation errors */,

    async (req: any, res: express.Response) => {
      return res
        .status(200)
        .json(
          objectReduceByMap(
            await RainDomain.rainPost(req.body, req),
            rainTransformOutputs.rainPost
          )
        );
    }
  );

  /**
   * Operation ID: rainPut
   * Summary: Get weather
   * Description: Query with varying content
   */

  router.put(
    '/',

    async (req: any, res: express.Response) => {
      return res
        .status(200)
        .json(
          objectReduceByMap(
            await RainDomain.rainPut(req.files, req),
            rainTransformOutputs.rainPut
          )
        );
    }
  );

  return router;
}
