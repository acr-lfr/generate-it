import HttpService from '../../lib/HttpService';
import { HttpMethodEnum } from '../enums/HttpMethodEnum';

import { CreateRain } from '../interfaces/CreateRain';
import { RainGetQuery } from '../interfaces/RainGetQuery';
import { RainPutFormData } from '../interfaces/RainPutFormData';
import { Weather } from '../interfaces/Weather';

class RainService extends HttpService {
  // rainGet
  public rainGet(
    query: RainGetQuery,
    additionalHeaders?: object
  ): Promise<Weather> {
    return this.sendRequest({
      method: HttpMethodEnum.GET,
      path: 'rain',
      headers: additionalHeaders || {},
      qs: query,
    });
  }

  // rainPost
  public rainPost(
    body: CreateRain,
    req: any,
    additionalHeaders?: object
  ): Promise<Weather> {
    return this.sendRequest({
      method: HttpMethodEnum.POST,
      path: 'rain',
      headers: additionalHeaders || {},
      body,
    });
  }

  // rainPut
  public rainPut(
    files: RainPutFormData,
    req: any,
    additionalHeaders?: object
  ): Promise<Weather> {
    return this.sendRequest({
      method: HttpMethodEnum.PUT,
      path: 'rain',
      headers: additionalHeaders || {},
      formData: files,
    });
  }
}

export default new RainService();
