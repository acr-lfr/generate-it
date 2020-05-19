import HttpService from '../../lib/HttpService';
import { HttpMethodEnum } from '../enums/HttpMethodEnum';

import { Weather } from '../interfaces/Weather';
import { WeatherFull } from '../interfaces/WeatherFull';
import { WeatherGetHeaders } from '../interfaces/WeatherGetHeaders';
import { WeatherGetQuery } from '../interfaces/WeatherGetQuery';
import { WeatherIdGetPath } from '../interfaces/WeatherIdGetPath';

class WeatherService extends HttpService {
  // weatherGet
  public weatherGet(
    headers: WeatherGetHeaders,
    jwtData: any,
    query: WeatherGetQuery,
    req: any,
    additionalHeaders?: object
  ): Promise<Weather> {
    return this.sendRequest({
      method: HttpMethodEnum.GET,
      path: 'weather',
      headers: additionalHeaders || {},
      header,
      qs: query,
    });
  }

  // weatherIdGet
  public weatherIdGet(
    jwtData: any,
    pathParams: WeatherIdGetPath,
    additionalHeaders?: object
  ): Promise<WeatherFull> {
    return this.sendRequest({
      method: HttpMethodEnum.GET,
      path: 'weather/:id',
      headers: additionalHeaders || {},
      params: pathParams,
    });
  }
}

export default new WeatherService();
