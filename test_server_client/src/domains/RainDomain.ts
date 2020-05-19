import {
  CreateRain,
  RainGetQuery,
  RainPutFormData,
  Weather,
} from '@/http/nodegen/interfaces';

import { RainDomainInterface } from '@/http/nodegen/domainInterfaces/RainDomainInterface';

import NodegenRequest from '../http/interfaces/NodegenRequest';

class RainDomain implements RainDomainInterface {
  /**
   * Operation ID: rainGet
   * Summary: Get weather
   * Description: Query with varying content
   */
  public async rainGet(query: RainGetQuery): Promise<Weather> {
    return {};
  }

  /**
   * Operation ID: rainPost
   * Summary: Get weather
   * Description: Query with varying content
   */
  public async rainPost(
    body: CreateRain,
    req: NodegenRequest
  ): Promise<Weather> {
    return {};
  }

  /**
   * Operation ID: rainPut
   * Summary: Get weather
   * Description: Query with varying content
   */
  public async rainPut(
    files: RainPutFormData,
    req: NodegenRequest
  ): Promise<Weather> {
    return {};
  }
}

export default new RainDomain();
