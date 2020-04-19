import {
  Weather,
  WeatherGetHeaders,
  WeatherGetPath,
  WeatherIdIdGetPath,
  WeatherIdIdPutPath,
  Weathers,
  weatherIdPutPut,
  weatherPostPost,
} from '@/http/nodegen/interfaces';
import { JwtAccess } from '@/http/nodegen/interfaces/JwtAccess';
import NodegenRequest from '@/http/nodegen/interfaces/NodegenRequest';

import WeatherDomainMock from './__mocks__/WeatherDomainMock';

class WeatherDomain {
  /**
   * Operation ID: weatherGet
   * Summary: weather data
   * Description: Get the latest temperatures
   */
  public async weatherGet(
    headers: WeatherGetHeaders,
    pathParams: WeatherGetPath
  ): Promise<Weathers> {
    return WeatherDomainMock.weatherGet(headers, pathParams);
  }

  /**
   * Operation ID: weatherPost
   * Summary: weather data
   * Description: Create a new weather record.
   */
  public async weatherPost(body: WeatherPostPost): Promise<Weather> {
    return WeatherDomainMock.weatherPost(body);
  }

  /**
   * Operation ID: weatherIdGet
   * Summary: weather data
   * Description: Get the latest temperatures
   */
  public async weatherIdGet(pathParams: WeatherIdIdGetPath): Promise<Weather> {
    return WeatherDomainMock.weatherIdGet(pathParams);
  }

  /**
   * Operation ID: weatherIdPut
   * Summary: weather data
   * Description: Create a new weather record.
   */
  public async weatherIdPut(
    body: WeatherIdPutPut,
    pathParams: WeatherIdIdPutPath
  ): Promise<Weather> {
    return WeatherDomainMock.weatherIdPut(body, pathParams);
  }
}

export default new WeatherDomain();
