import {
  CreateRain,
  RainGetQuery,
  RainPutFormData,
  Weather,
} from '@/http/nodegen/interfaces';

import NodegenRequest from '@/http/interfaces/NodegenRequest';

export interface RainDomainInterface {
  /**
   * Operation ID: rainGet
   * Summary: Get weather
   * Description: Query with varying content
   */
  rainGet(query: RainGetQuery): Promise<Weather>;

  /**
   * Operation ID: rainPost
   * Summary: Get weather
   * Description: Query with varying content
   */
  rainPost(body: CreateRain, req: any): Promise<Weather>;

  /**
   * Operation ID: rainPut
   * Summary: Get weather
   * Description: Query with varying content
   */
  rainPut(files: RainPutFormData, req: any): Promise<Weather>;
}
