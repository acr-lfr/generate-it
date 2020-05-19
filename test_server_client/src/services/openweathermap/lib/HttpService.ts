import request from 'request-promise';
import config from '@/config';
import { RequestObject } from '../nodegen/interfaces/RequestObject';

const urlJoin = require('url-join');

export default class HttpService {
  /**
   * Injects the values into a path
   * @param {Object} params
   * @param {String} path
   */
  private static injectParamsToPath (params: object = {}, path: string) {
    Object.keys(params).forEach((param) => {
      path = path.replace(':' + param, params[param]);
    });
    return path;
  }

  /**
   * Make the http requestPromise
   * @param {RequestObject} requestObject
   */
  public async sendRequest (requestObject: RequestObject): Promise<any> {
    return new Promise((resolve, reject) => {
      requestObject.headers = Object.assign(requestObject.headers || {}, {
        Connection: 'keep-alive',
      });
      const URL = urlJoin(
              config.baseUrl,
              HttpService.injectParamsToPath(
                      requestObject.params,
                      requestObject.path,
              ),
      );
      try {
        let requestPromiseObject;
        if (requestObject.formData) {
          requestPromiseObject = {
            headers: requestObject.headers,
            method: requestObject.method,
            gzip: true,
            formData: requestObject.formData,
            resolveWithFullResponse: true,
            url: URL,
          };
        } else {
          requestPromiseObject = {
            body: requestObject.body,
            headers: requestObject.headers,
            json: true,
            method: requestObject.method,
            qs: requestObject.qs,
            gzip: true,
            resolveWithFullResponse: true,
            url: URL,
          };
        }
        request(requestPromiseObject, (err, httpResponse, body) => {
          if (err) {
            reject(err);
          } else {
            resolve(httpResponse);
          }
        });
      } catch (error) {
        throw error;
      }
    });
  }
}
