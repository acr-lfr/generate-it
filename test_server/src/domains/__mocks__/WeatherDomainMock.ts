import { mockItGenerator } from 'openapi-nodegen-mockers';

import { Weather } from '@/http/nodegen/interfaces/Weather';
import { WeatherGetHeaders } from '@/http/nodegen/interfaces/WeatherGetHeaders';
import { WeatherGetPath } from '@/http/nodegen/interfaces/WeatherGetPath';
import { WeatherIdIdGetPath } from '@/http/nodegen/interfaces/WeatherIdIdGetPath';
import { WeatherIdIdPutPath } from '@/http/nodegen/interfaces/WeatherIdIdPutPath';
import { Weathers } from '@/http/nodegen/interfaces/Weathers';
import { weatherIdPutPut } from '@/http/nodegen/interfaces/weatherIdPutPut';
import { weatherPostPost } from '@/http/nodegen/interfaces/weatherPostPost';

class WeatherDomainMock {
  // Operation ID: weatherGet
  async weatherGet(
    headers: WeatherGetHeaders,
    pathParams: WeatherGetPath
  ): Promise<Weathers> {
    return mockItGenerator({
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            totalResultCount: { type: 'number' },
            offset: { type: 'number' },
            limit: { type: 'number' },
          },
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              date: { type: 'string', format: 'date' },
              location: { type: 'string' },
              cloudCoverPercentage: { type: 'integer' },
              humidityPercentage: { type: 'integer' },
              temperature: { type: 'number' },
            },
          },
        },
      },
    });
  }

  // Operation ID: weatherPost
  async weatherPost(body: WeatherPostPost): Promise<Weather> {
    return mockItGenerator({
      type: 'object',
      properties: {
        id: { type: 'integer' },
        date: { type: 'string', format: 'date' },
        location: { type: 'string' },
        cloudCoverPercentage: { type: 'integer' },
        humidityPercentage: { type: 'integer' },
        temperature: { type: 'number' },
      },
    });
  }

  // Operation ID: weatherIdGet
  async weatherIdGet(pathParams: WeatherIdIdGetPath): Promise<Weather> {
    return mockItGenerator({
      type: 'object',
      properties: {
        id: { type: 'integer' },
        date: { type: 'string', format: 'date' },
        location: { type: 'string' },
        cloudCoverPercentage: { type: 'integer' },
        humidityPercentage: { type: 'integer' },
        temperature: { type: 'number' },
      },
    });
  }

  // Operation ID: weatherIdPut
  async weatherIdPut(
    body: WeatherIdPutPut,
    pathParams: WeatherIdIdPutPath
  ): Promise<Weather> {
    return mockItGenerator({
      type: 'object',
      properties: {
        id: { type: 'integer' },
        date: { type: 'string', format: 'date' },
        location: { type: 'string' },
        cloudCoverPercentage: { type: 'integer' },
        humidityPercentage: { type: 'integer' },
        temperature: { type: 'number' },
      },
    });
  }
}
export default new WeatherDomainMock();
