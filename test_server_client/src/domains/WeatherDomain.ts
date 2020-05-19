import {
  Weather,
  WeatherFull,
  WeatherGetHeaders,
  WeatherGetQuery,
  WeatherIdGetPath,
} from '@/http/nodegen/interfaces';

import { WeatherDomainInterface } from '@/http/nodegen/domainInterfaces/WeatherDomainInterface';
import { JwtAccess } from '@/http/nodegen/interfaces/JwtAccess';
import NodegenRequest from '../http/interfaces/NodegenRequest';

class WeatherDomain implements WeatherDomainInterface {
  /**
   * Operation ID: weatherGet
   * Summary: Get weather
   * Description: Query with varying content
   */
  public async weatherGet(
    headers: WeatherGetHeaders,
    jwtData: JwtAccess,
    query: WeatherGetQuery,
    req: NodegenRequest
  ): Promise<Weather> {
    return {};
  }

  /**
   * Operation ID: weatherIdGet
   * Summary: Get weather
   * Description: Query with varying content
   */
  public async weatherIdGet(
    jwtData: JwtAccess | undefined,
    params: WeatherIdGetPath
  ): Promise<WeatherFull> {
    return {};
  }
}

export default new WeatherDomain();
