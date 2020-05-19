import {
  Weather,
  WeatherFull,
  WeatherGetHeaders,
  WeatherGetQuery,
  WeatherIdGetPath,
} from '@/http/nodegen/interfaces';
import { JwtAccess } from '@/http/nodegen/interfaces/JwtAccess';
import NodegenRequest from '@/http/interfaces/NodegenRequest';

export interface WeatherDomainInterface {
  /**
   * Operation ID: weatherGet
   * Summary: Get weather
   * Description: Query with varying content
   */
  weatherGet(
    headers: WeatherGetHeaders,
    jwtData: JwtAccess,
    query: WeatherGetQuery,
    req: any
  ): Promise<Weather>;

  /**
   * Operation ID: weatherIdGet
   * Summary: Get weather
   * Description: Query with varying content
   */
  weatherIdGet(
    jwtData: JwtAccess | undefined,
    params: WeatherIdGetPath
  ): Promise<WeatherFull>;
}
