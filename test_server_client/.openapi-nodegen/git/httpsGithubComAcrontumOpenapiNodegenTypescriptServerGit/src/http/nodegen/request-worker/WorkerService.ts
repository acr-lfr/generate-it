import { IncomingMessage } from 'http';
import { pick } from 'lodash';
import workerFarm from 'worker-farm';
import config from '@/config';
import NodegenRequest from '@/http/interfaces/NodegenRequest';
import { WorkerData } from './types';

const REQUEST_SERIALIZED_KEYS: string[] = [
  'jwtData',
  'xApiKey',
  'originalToken',
  'headers',
  'protocol',
  'hostname',
  'url',
  'originalUrl',
  'query',
  'params',
  'body',
];
// Check the config default config to ensure you have the
// worker attibutes: https://github.com/acrontum/openapi-nodegen-typescript-server/blob/master/src/config.ts
// Ensure you also have in the package.json:
// "node-worker-threads-pool": "^1.2.2",
// "worker-farm": "^1.7.0",
const execWorker = workerFarm(
  {
    maxConcurrentWorkers: config.requestWorker.processes,
    maxConcurrentCallsPerWorker: config.requestWorker.threadsPerProcess,
    maxRetries: 1,
    autoStart: true,
  },
  `${process.cwd()}/build/src/http/nodegen/request-worker/process.js`,
);

class WorkerService {
  /**
   * This will never be overridden.
   * If the swagger path contains x-request-proxy this services is used.
   * @param req
   * @param domainName
   * @param domainFunction
   * @param domainFunctionArgs
   */
  public handleRequestWithWorker (req: NodegenRequest, domainName: string, domainFunction: string, domainFunctionArgs: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const workerData: WorkerData = {
        domainName,
        domainFunction,
        domainFunctionArgs: domainFunctionArgs.map((arg) => {
          if (arg instanceof IncomingMessage) {
            return pick(req, REQUEST_SERIALIZED_KEYS);
          }
          return arg;
        }),
      };

      execWorker(workerData, (error?: any, response?: any) => {
        if (error) {
          return reject(Error(error));
        }
        resolve(response);
      });
    });
  }
}

export default new WorkerService();
